const db = require("../db");
const dayjs = require("dayjs");

const getNextInvoiceNumber = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT MAX(CAST(SUBSTRING(bill_no, 5) AS UNSIGNED)) as max_num 
      FROM invoice_table 
      WHERE bill_no LIKE 'INV-%'
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.error("Error getting next invoice number:", err);
        reject(err);
        return;
      }

      const maxNum = result[0].max_num || 0;
      const nextNum = maxNum + 1;
      const paddedNum = nextNum.toString().padStart(4, "0");
      const invoiceNo = `INV-${paddedNum}`;
      console.log("Generated invoice number:", invoiceNo);
      resolve(invoiceNo);
    });
  });
};

const getNextInvoiceNumberEndpoint = async (req, res) => {
  try {
    const nextInvoiceNo = await getNextInvoiceNumber();
    console.log("Sending invoice number:", nextInvoiceNo);
    res.json({ bill_no: nextInvoiceNo });
  } catch (error) {
    console.error("Error getting next invoice number:", error);
    res.status(500).json({ error: error.message });
  }
};

const addinvoice = (req, res) => {
  console.log("Received data:", req.body);

  const { order_no, bill_no, bill_date, amount } = req.body;

  const formattedOrderDate = dayjs(bill_date).format("YYYY-MM-DD");

  db.query(
    "INSERT INTO invoice_table (order_no, bill_no, bill_date, amount ) VALUES (?, ?, ?, ?)",
    [order_no, bill_no, formattedOrderDate, amount],
    (err, result) => {
      if (err) {
        // Check for duplicate entry error (MySQL error code 1062)
        if (err.code === "ER_DUP_ENTRY") {
          console.warn("Duplicate order_no detected, skipping insert.");
          return res
            .status(200)
            .json({ message: "Duplicate order_no. Invoice not inserted." });
        }

        // Other SQL errors
        console.error("SQL Error:", err);
        return res.status(500).json({
          message: "Database error occurred while creating invoice.",
          sqlMessage: err.sqlMessage,
          sql: err.sql,
        });
      }

      console.log("Invoice submitted");
      res
        .status(200)
        .json({ message: "Invoice created", invoiceId: result.insertId });
    }
  );
};

const getinvoices = (req, res) => {
  const query = `
    SELECT 
      i.*,
      o.customer_id,
      c.customer_name
    FROM invoice_table i
    INNER JOIN order_table o ON i.order_no = o.order_no
    INNER JOIN customer_table c ON o.customer_id = c.customer_id
    ORDER BY i.bill_date DESC
  `;

  console.log("Executing query:", query);

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching invoice data:", err);
      return res.status(500).json({ error: err });
    }
    console.log("Query result:", result);
    res.json({ invoices: result });
  });
};

const getinvoiceByOrderNo = (req, res) => {
  const invoiceorder_no = req.params.order_no;

  const query = `
    SELECT 
      i.*, 
      o.customer_id, o.supplier_id,
      o.order_qty, o.unit_of_measurement, o.rate,
      c.customer_name,
      c.address as customer_address,
      s.supplier_name, 
      p.product_name,
      p.product_id,
      s.address as supplier_address
    FROM invoice_table i
    JOIN order_table o ON i.order_no = o.order_no
    JOIN customer_table c ON o.customer_id = c.customer_id
    JOIN supplier_table s ON o.supplier_id = s.supplier_id
    JOIN product_table p ON o.product_id = p.product_id

    WHERE i.order_no = ?
  `;

  db.query(query, [invoiceorder_no], (err, result) => {
    if (err) {
      console.log(err);
      console.error("Error fetching invoices:", err);
      return res.status(500).json({ error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    // Format dates and include extra fields
    const formattedInvoices = result.map((invoice) => ({
      ...invoice,
      bill_date: dayjs(invoice.bill_date).format("YYYY-MM-DD"),
      customer_name: invoice.customer_name,
      customer_address: invoice.customer_address,
      supplier_name: invoice.supplier_name,
      supplier_address: invoice.supplier_address,
      product_name: invoice.product_name,
      quantity_order: invoice.quantity,
      unit_of_measurement: invoice.unit_of_measurement,
      rate: invoice.rate,
    }));

    res.json({ invoices: formattedInvoices });
  });
};

const updateinvoiceandorder = (req, res) => {
  const { bill_no } = req.params; // Get bill_no from URL
  const {
    amount,
    product_id,
    customer_id,
    supplier_id,
    order_qty,
    rate,
    order_no,
  } = req.body; // Get fields to update

  console.log("Received data for update:", req.body);

  const invoicequery = `
    UPDATE invoice_table 
    SET amount = ?
    WHERE bill_no = ?
  `;

  db.query(invoicequery, [amount, bill_no], (err, result) => {
    if (err) {
      console.error("Error updating invoice:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    console.log("Invoice updated");

    const orderQuery = `
      UPDATE order_table
      SET product_id = ?, customer_id = ?, supplier_id = ?, order_qty = ?, rate = ?, total_amount = ?
      WHERE order_no = ?
    `;

    db.query(
      orderQuery,
      [product_id, customer_id, supplier_id, order_qty, rate, amount, order_no],
      (orderErr, orderResult) => {
        if (orderErr) {
          console.error("Error updating order:", orderErr);
          return res.status(500).json({ error: orderErr });
        }

        if (orderResult.affectedRows === 0) {
          return res.status(404).json({ message: "Order not found" });
        }

        // Now update payment_table using bill_no
        const paymentQuery = `
          UPDATE payment_table
          SET total_amount = ?
          WHERE bill_no = ?
        `;

        db.query(
          paymentQuery,
          [amount, bill_no],
          (paymentErr, paymentResult) => {
            if (paymentErr) {
              console.error("Error updating payment:", paymentErr);
              return res.status(500).json({ error: paymentErr });
            }

            if (paymentResult.affectedRows === 0) {
              return res
                .status(404)
                .json({ message: "Payment record not found" });
            }

            return res.status(200).json({
              message: "Invoice, Order, and Payment updated successfully",
            });
          }
        );
      }
    );
  });
};

const deleteinvoice = (req, res) => {
  const invoiceId = req.params.id;

  db.query(
    "DELETE FROM invoice_table WHERE invoice_id = ?",
    [invoiceId],
    (err, result) => {
      if (err) {
        console.error("Error deleting invoice:", err);
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      console.log("Invoice deleted successfully");
      res.json({ message: "Invoice deleted successfully" });
    }
  );
};

const deleteinvoicebyorderno = (req, res) => {
  const invoiceId = req.params.order_no;

  db.query(
    "DELETE FROM invoice_table WHERE order_no = ?",
    [invoiceId],
    (err, result) => {
      if (err) {
        console.error("Error deleting invoice:", err);
        return res.status(500).json({ error: err });
      }

      console.log("Invoice deleted successfully");
      res.json({ message: "Invoice deleted successfully" });
    }
  );
};

const getOutstandingInvoices = (req, res) => {
  const { customer, supplier, startDate, endDate, invoiceStatus } = req.query;

  let query = `
    SELECT 
      i.invoice_id,
      i.bill_no,
      i.bill_date,
      i.amount as total_amount,
      c.customer_name,
      s.supplier_name,
      p.remaining_amount,
      CASE 
        WHEN i.amount > 0 AND i.amount = i.amount THEN 'Unpaid'
        WHEN i.amount > 0 AND i.amount < i.amount THEN 'Partially Paid'
        WHEN i.bill_date < CURDATE() AND i.amount > 0 THEN 'Overdue'
        ELSE 'Paid'
      END as invoice_status
    FROM invoice_table i
        INNER JOIN payment_table p ON i.bill_no = p.bill_no
        INNER JOIN order_table o ON i.order_no = o.order_no
        INNER JOIN customer_table c ON o.customer_id = c.customer_id
        INNER JOIN supplier_table s ON o.supplier_id = s.supplier_id
    WHERE i.amount > 0
  `;

  const queryParams = [];

  if (customer) {
    query += ` AND c.customer_name LIKE ?`;
    queryParams.push(`%${customer}%`);
  }
  if (supplier) {
    query += ` AND s.supplier_name LIKE ?`;
    queryParams.push(`%${supplier}%`);
  }

  if (startDate) {
    query += ` AND i.bill_date >= ?`;
    queryParams.push(startDate); // startDate will be in 'yyyy-MM-dd' format
  }

  if (endDate) {
    query += ` AND i.bill_date <= ?`;
    queryParams.push(endDate); // endDate will be in 'yyyy-MM-dd' format
  }

  if (invoiceStatus) {
    switch (invoiceStatus.toLowerCase()) {
      case "unpaid":
        query += ` AND i.amount > 0 AND i.amount = i.amount`;
        break;
      case "partially paid":
        query += ` AND i.amount > 0 AND i.amount < i.amount`;
        break;
      case "overdue":
        query += ` AND i.bill_date < CURDATE() AND i.amount > 0`;
        break;
      default:
        break;
    }
  }

  query += ` ORDER BY i.bill_date DESC`;

  console.log("Executing query:", query);
  console.log("Query params:", queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching outstanding invoices:", err);
      return res.status(500).json({ error: err });
    }
    res.json({ outstandings: results });
  });
};

module.exports = {
  addinvoice,
  getinvoices,
  getinvoiceByOrderNo,
  updateinvoiceandorder,
  deleteinvoice,
  getNextInvoiceNumber,
  getNextInvoiceNumberEndpoint,
  getOutstandingInvoices,
  deleteinvoicebyorderno,
};
