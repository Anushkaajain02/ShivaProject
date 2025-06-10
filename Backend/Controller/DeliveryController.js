const db = require("../db");

// Get all orders with their delivery status
const getOrdersWithDeliveryStatus = (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.order_no,
      s.supplier_name,
      c.customer_name,
      o.order_qty as total_qty,
      o.order_date,
      COALESCE(SUM(d.pd_quantity), 0) as delivered_qty,
      d.lr_no,
      d.lr_date,
      d.shipment_mode,
      d.pd_bale_quantity,
      COALESCE(d.status, 'Pending') as status
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    LEFT JOIN customer_table c ON o.customer_id = c.customer_id

    LEFT JOIN delivery_table d ON o.order_no = d.order_no
    GROUP BY o.order_id, o.order_no, s.supplier_name, o.order_qty, o.order_date, d.lr_no, d.lr_date, d.shipment_mode, d.pd_bale_quantity, d.status
    ORDER BY o.order_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders with delivery status:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
};

// Get delivery history for a specific order
const getDeliveryHistory = (req, res) => {
  const orderId = req.params.orderId;

  const query = `
    SELECT 
      d.delivery_id as id,
      o.order_no,
      d.delivery_date,
      d.pd_quantity as delivered_qty,
      d.undelivered_qty,
      d.lr_no,
      d.lr_date,
      d.shipment_mode,
      d.pd_bale_quantity,
      d.remarks,
      d.created_at
    FROM delivery_table d
    JOIN order_table o ON d.order_no = o.order_no
    WHERE o.order_id = ?
    ORDER BY d.created_at DESC
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching delivery history:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
};

// Record a new delivery
const recordDelivery = (req, res) => {
  const {
    order_id,
    new_delivery_qty,
    delivery_date,
    lr_no,
    lr_date,
    shipment_mode,
    pd_bale_quantity,
    comment,
  } = req.body;

  // Ensure numeric values are converted to numbers
  const pdQuantity = Number(new_delivery_qty);
  const baleQuantity = Number(pd_bale_quantity);

  // Log the data to check the values
  console.log(req.body);

  const checkOrderQuery = `
    SELECT o.*, s.supplier_name 
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    WHERE o.order_id = ?
  `;

  db.query(checkOrderQuery, [order_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database error while checking order" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = results[0];

    const getDeliveredQuery = `
      SELECT COALESCE(SUM(pd_quantity), 0) as total_delivered 
      FROM delivery_table 
      WHERE order_no = ?
    `;

    db.query(getDeliveredQuery, [order.order_no], (err, deliveryResults) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database error while checking delivery quantity" });
      }

      const totalDelivered = deliveryResults[0].total_delivered;
      const remaining_qty = order.order_qty - totalDelivered;

      if (pdQuantity > remaining_qty) {
        return res.status(400).json({
          error: `Cannot deliver more than remaining quantity (${remaining_qty})`,
        });
      }

      const undelivered_qty = remaining_qty - pdQuantity;
      const totalDeliveredNew = totalDelivered + pdQuantity;

      let status =
        totalDeliveredNew >= order.order_qty
          ? "Delivered"
          : totalDeliveredNew === pdQuantity
          ? "Pending"
          : "Partially Delivered";

      const insertQuery = `
        INSERT INTO delivery_table 
          (order_no, pd_quantity, undelivered_qty, delivery_date, lr_no, lr_date, shipment_mode, pd_bale_quantity, remarks, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertValues = [
        order.order_no,
        pdQuantity, // Convert to number before inserting
        undelivered_qty,
        delivery_date,
        lr_no,
        lr_date,
        shipment_mode,
        baleQuantity, // Convert to number before inserting
        comment,
        status,
      ];

      db.query(insertQuery, insertValues, (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Database error while recording delivery" });
        }

        res.status(200).json({
          success: true, // Add success field
          message: "Delivery recorded successfully",
          delivery_id: result.insertId,
          undelivered_qty: undelivered_qty,
          order_no: order.order_no,
        });
      });
    });
  });
};

// Get order details by ID
const getOrder = (req, res) => {
  const orderId = req.params.orderId;

  const query = `
    SELECT 
      o.order_id,
      o.order_no,
      s.supplier_name,
      o.order_qty as total_qty,
      o.order_date
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    LEFT JOIN invoice_table i ON o.order_no = i.order_no
    WHERE o.order_id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ data: results[0] });
  });
};

// Get delivery data by order_no
const getDeliveryDataByOrderNo = (req, res) => {
  const { order_no } = req.params;

  const query = `
    SELECT 
      o.order_id,
      o.order_no,
      s.supplier_name,
      o.order_qty as total_qty,
      o.order_date,
      -- Sum the delivered quantities from the delivery_table for the same order_no
      COALESCE(SUM(d.pd_quantity), 0) as total_delivered_qty,  -- Total delivered quantity (sum of pd_quantity)
      d.lr_no,
      d.lr_date,
      d.shipment_mode,
      d.pd_bale_quantity,
      COALESCE(d.status, 'Pending') as status,
      (
        SELECT CONCAT('[', 
          GROUP_CONCAT(
            JSON_OBJECT(
              'id', dh.delivery_id,
              'delivery_date', dh.delivery_date,
              'pd_quantity', dh.pd_quantity,
              'undelivered_qty', dh.undelivered_qty,
              'lr_no', dh.lr_no,
              'lr_date', dh.lr_date,
              'shipment_mode', dh.shipment_mode,
              'pd_bale_quantity', dh.pd_bale_quantity,
              'remarks', dh.remarks,
              'created_at', dh.created_at
            )
          ), ']'
        )
        FROM delivery_table dh
        WHERE dh.order_no = o.order_no
        ORDER BY dh.created_at DESC
      ) as delivery_history
    FROM order_table o
    LEFT JOIN supplier_table s ON o.supplier_id = s.supplier_id
    LEFT JOIN delivery_table d ON o.order_no = d.order_no
    WHERE o.order_no = ?
    GROUP BY o.order_id, o.order_no, s.supplier_name, o.order_qty, o.order_date, d.lr_no, d.lr_date, d.shipment_mode, d.pd_bale_quantity, d.status
  `;

  db.query(query, [order_no], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const result = results[0];
    let deliveryHistory = [];

    if (result.delivery_history) {
      try {
        deliveryHistory = JSON.parse(result.delivery_history);
      } catch (e) {
        console.error("Error parsing delivery history:", e);
      }
    }

    // Calculate the total delivered quantity by summing up pd_quantity from delivery history
    const totalDelivered = deliveryHistory.reduce(
      (sum, delivery) => sum + parseFloat(delivery.pd_quantity || 0),
      0
    );

    const orderQty = parseFloat(result.total_qty);
    result.status =
      totalDelivered >= orderQty
        ? "Delivered"
        : totalDelivered === 0
        ? "Pending"
        : "Partially Delivered";

    result.total_delivered_qty = totalDelivered; // Update total_delivered_qty with the sum of pd_quantity
    result.delivery_history = deliveryHistory;

    res.json({ data: result });
  });
};

module.exports = {
  getOrdersWithDeliveryStatus,
  getDeliveryHistory,
  recordDelivery,
  getOrder,
  getDeliveryDataByOrderNo,
};
