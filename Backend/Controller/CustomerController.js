const db = require("../db");

const addcustomer = (req, res) => {
  console.log("Received data:", req.body);

  const { customer_name, contact_info, address, gst_no, credit_limit } = req.body;

  db.query(
    "INSERT INTO customer_table (customer_name, contact_info, address,  gst_no, credit_limit) VALUES (?, ?, ?, ?, ?)",
    [customer_name, contact_info, address, gst_no, credit_limit],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User created", userId: result.insertId });
    }
  );
};

const getcustomer = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  // First, get total count
  db.query("SELECT COUNT(*) AS count FROM customer_table", (err, countResult) => {
    if (err) {
      console.error("Error counting customer:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    // Now, get paginated results
    db.query("SELECT * FROM customer_table LIMIT ? OFFSET ?", [limit, offset], (err, data) => {
      if (err) {
        console.error("Error fetching paginated customer:", err);
        return res.status(500).json({ error: err });
      }

      res.json({
        total,
        page,
        limit,
        data,
      });
    });
  });
};

const GetCustomerById = (req, res) => {
  const customerId = req.params.id;

  db.query("SELECT * FROM customer_table WHERE customer_id = ?", [customerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching Customer by ID:", err);
      return res.status(500).json({ error: "Error fetching Customer by ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log("✅ Customer Detail fetched:", results[0]);
    res.status(200).json(results[0]);
  });
};

const updatecustomer = (req, res) => {
  console.log("Received data for update:", req.body);

  const { customer_name, address, contact_info, gst_no, credit_limit } = req.body;
  const customerId = req.params.id; // assuming the ID is passed as a route param

  db.query(
    "UPDATE customer_table SET customer_name = ?, contact_info = ?, address = ?,  gst_no = ?, credit_limit = ? WHERE customer_id = ?",
    [customer_name, contact_info, address, gst_no, credit_limit, customerId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "customer not found" });
      }

      res.json({ message: "customer updated successfully" });
    }
  );
};

const deletecustomer = (req, res) => {
  const customerId = req.params.id;

  db.query("DELETE FROM customer_table WHERE customer_id = ?", [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "customer not found" });
    }
    console.log("customer deleted successfully");
    res.json({ message: "customer deleted successfully" });
  });
};

const getCustomerLedger = (req, res) => {
  const { startDate, endDate } = req.query;

  let query = `
    SELECT 
      c.customer_id,
      c.customer_name,
      COUNT(DISTINCT CASE 
        WHEN ? IS NULL OR ? IS NULL OR (o.order_date BETWEEN ? AND ?)
        THEN o.order_no 
        END) as total_orders,
      COUNT(DISTINCT CASE 
        WHEN ? IS NULL OR ? IS NULL OR (o.order_date BETWEEN ? AND ?)
        THEN i.invoice_id 
        END) as total_invoices,
      COALESCE(SUM(CASE 
        WHEN ? IS NULL OR ? IS NULL OR (o.order_date BETWEEN ? AND ?)
        THEN i.amount 
        ELSE 0 
        END), 0) as total_amount,
      CASE 
        WHEN COUNT(DISTINCT i.invoice_id) > 0 THEN 'Active'
        ELSE 'Inactive'
      END as status
    FROM customer_table c
    LEFT JOIN order_table o ON c.customer_id = o.customer_id
    LEFT JOIN invoice_table i ON o.order_no = i.order_no
    GROUP BY c.customer_id, c.customer_name
    ORDER BY c.customer_name
  `;

  const queryParams = [
    startDate,
    endDate,
    startDate,
    endDate, // For total_orders
    startDate,
    endDate,
    startDate,
    endDate, // For total_invoices
    startDate,
    endDate,
    startDate,
    endDate, // For total_amount
  ];

  console.log("Executing customer ledger query:", query);
  console.log("Query parameters:", queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching customer ledger:", err);
      return res.status(500).json({ error: err });
    }

    console.log("Customer ledger results:", results);
    res.json({ data: results });
  });
};

module.exports = {
  addcustomer,
  getcustomer,
  deletecustomer,
  updatecustomer,
  GetCustomerById,
  getCustomerLedger,
};
