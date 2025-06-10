const db = require("../db");

const dayjs = require("dayjs");

const getNextOrderNumber = () => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT MAX(CAST(SUBSTRING(order_no, 7) AS UNSIGNED)) as max_num 
            FROM order_table 
            WHERE order_no LIKE 'SHIVA%'
        `;

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error getting next order number:", err);
        reject(err);
        return;
      }

      const maxNum = result[0].max_num || 0;
      console.log("max number", maxNum);
      const nextNum = maxNum + 1;
      const paddedNum = nextNum.toString().padStart(4, "0");
      const orderNo = `SHIVA-${paddedNum}`;
      console.log("Generated order number:", orderNo);
      resolve(orderNo);
    });
  });
};

const getNextOrderNumberEndpoint = async (req, res) => {
  try {
    const nextOrderNo = await getNextOrderNumber();
    console.log("Sending order number:", nextOrderNo);
    res.json({ order_no: nextOrderNo });
  } catch (error) {
    console.error("Error getting next order number:", error);
    res.status(500).json({ error: error.message });
  }
};

const addorder = (req, res) => {
  console.log("Received order data:", req.body);

  const {
    order_no,
    supplier_id,
    order_date,
    customer_id,
    consignee,
    place,
    quality_remark,
    order_qty,
    unit_of_measurement,
    rate,
    product_id,
    total_amount,
  } = req.body;

  // Format dates to MySQL format
  const formattedOrderDate = dayjs(order_date).format("YYYY-MM-DD");

  const query = `INSERT INTO order_table 
        (order_no, supplier_id, order_date, customer_id, consignee, place, quality_remark, order_qty, unit_of_measurement, rate, product_id, total_amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    order_no,
    supplier_id,
    formattedOrderDate,
    customer_id,
    consignee,
    place,
    quality_remark,
    order_qty,
    unit_of_measurement,
    rate,
    product_id,
    total_amount,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    res.json({
      message: "Order entry created",
      orderId: result.insertId,
      order_no: result.orderNo,
      order_date: result.orderDate, // format if needed
    });
  });
};

const getorder = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS count FROM order_table", (err, countResult) => {
    if (err) {
      console.error("Error counting order:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    const query = `
      SELECT 
  o.order_id,
  o.order_no,
  o.supplier_id,
  o.order_date,
  o.customer_id,
  o.consignee,
  o.place,
  o.quality_remark,
  o.order_qty,
  o.unit_of_measurement,
  o.rate,
  o.product_id,
  o.total_amount,
  s.supplier_name,
  c.customer_name,
  pdt.product_name,

  -- Calculate due amount
  (
    o.total_amount - IFNULL((
      SELECT SUM(pm.amount_paid)
      FROM invoice_table inv
      LEFT JOIN payment_table pm ON pm.bill_no = inv.bill_no
      WHERE inv.order_no = o.order_no
    ), 0)
  ) AS due_amount

FROM order_table o
LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
LEFT JOIN customer_table c ON o.customer_id = c.customer_id
LEFT JOIN product_table pdt ON o.product_id = pdt.product_id

GROUP BY o.order_id
LIMIT ? OFFSET ?
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.error("Error fetching paginated order:", err);
        return res.status(500).json({ error: err });
      }

      const formattedResults = results.map((row) => ({
        ...row,
        order_date: row.order_date
          ? dayjs(row.order_date).format("YYYY-MM-DD")
          : null,
        lr_date: row.lr_date ? dayjs(row.lr_date).format("YYYY-MM-DD") : null,
      }));

      res.json({
        total,
        page,
        limit,
        data: formattedResults,
      });
    });
  });
};

const updateorder = (req, res) => {
  console.log("Received data for update:", req.body);

  const {
    order_no,
    supplier_id,
    order_date,
    customer_id,
    consignee,
    place,
    quality_remark,
    order_qty,
    unit_of_measurement,
    rate,
    total_amount,
  } = req.body;
  const orderId = req.params.id;

  // Step 1: Update order_table
  db.query(
    `UPDATE order_table 
     SET order_no = ?, supplier_id = ?, order_date = ?, customer_id = ?, consignee = ?, 
         place = ?, quality_remark = ?, order_qty = ?, unit_of_measurement = ?, rate = ?, total_amount = ?
     WHERE order_id = ?`,
    [
      order_no,
      supplier_id,
      order_date,
      customer_id,
      consignee,
      place,
      quality_remark,
      order_qty,
      unit_of_measurement,
      rate,
      total_amount,
      orderId,
    ],
    (err, result) => {
      if (err) {
        console.log("Order update error:", err);
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Step 2: Update invoice_table
      db.query(
        `UPDATE invoice_table SET amount = ? WHERE order_no = ?`,
        [total_amount, order_no],
        (invoiceErr, invoiceResult) => {
          if (invoiceErr) {
            console.log("Invoice update error:", invoiceErr);
            return res.status(500).json({ error: invoiceErr });
          }

          // Step 3: Fetch bill_no from invoice_table
          db.query(
            `SELECT bill_no FROM invoice_table WHERE order_no = ?`,
            [order_no],
            (selectErr, selectResult) => {
              if (selectErr) {
                console.log("Error fetching bill_no:", selectErr);
                return res.status(500).json({ error: selectErr });
              }

              if (selectResult.length === 0) {
                return res.status(404).json({ error: "Invoice not found for this order_no" });
              }

              const bill_no = selectResult[0].bill_no;

              // Step 4: Update payment_table using bill_no
              db.query(
                `UPDATE payment_table SET total_amount = ? WHERE bill_no = ?`,
                [total_amount, bill_no],
                (paymentErr, paymentResult) => {
                  if (paymentErr) {
                    console.log("Payment update error:", paymentErr);
                    return res.status(500).json({ error: paymentErr });
                  }

                  return res.json({ message: "Order, Invoice, and Payment updated successfully" });
                }
              );
            }
          );
        }
      );
    }
  );
};



const deleteorder = (req, res) => {
  const orderId = req.params.id;

  db.query(
    "DELETE FROM order_table WHERE order_id = ?",
    [orderId],
    (err, result) => {
      if (err) {
        console.error("Error deleting order:", err);
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "order not found" });
      }
      console.log("order deleted successfully");
      res.json({ message: "order deleted successfully" });
    }
  );
};

const GetOrderById = (req, res) => {
  const orderId = req.params.id;

  const query = `
    SELECT 
      o.*,
      s.supplier_name,
      s.address as supplier_address,
      s.gst_no as supplier_gstno,      
      c.customer_name,
      c.address as customer_address, 
      c.gst_no as customer_gstno,    
      p.product_name
      
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    LEFT JOIN customer_table c ON o.customer_id = c.customer_id
    LEFT JOIN product_table p ON o.product_id = p.product_id
    WHERE o.order_id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.log(err);
      console.error("❌ Error fetching order by ID:", err);
      return res.status(500).json({ error: "Error fetching order by ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = results[0];
    order.order_date = dayjs(order.order_date).format("YYYY-MM-DD");

    res.status(200).json(order);
  });
};

const GetOrderDetailsWithNames = (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.order_no,
      o.order_date,
      o.consignee,
      o.place,
      o.quality_remark,
      o.order_qty,
      o.unit_of_measurement,
      o.rate,
      s.supplier_name,
      c.customer_name
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    LEFT JOIN customer_table c ON o.customer_id = c.customer_id
    ORDER BY o.order_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching order details with names:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching order details",
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
};

module.exports = {
  addorder,
  getorder,
  deleteorder,
  GetOrderById,
  updateorder,
  getNextOrderNumber,
  getNextOrderNumberEndpoint,
  GetOrderDetailsWithNames,
};
