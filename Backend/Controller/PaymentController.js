const db = require("../db");

const addpayment = (req, res) => {
  console.log("Received payment data:", req.body);

  const {
    payment_mode,
    payment_date,
    remarks,
    bill_no,
    discount = 0,
    total_amount,
    amount_paid,
    status,
  } = req.body;

  // Step 1: Fetch sum of amount_paid for the given bill_no
  const sumQuery = `SELECT SUM(amount_paid) AS total_paid FROM payment_table WHERE bill_no = ?`;

  db.query(sumQuery, [bill_no], (err, sumResult) => {
    if (err) {
      console.error("Error fetching previous payments:", err);
      return res.status(500).json({ error: err });
    }

    const previousPaid = parseFloat(sumResult[0].total_paid) || 0;
const amountPaid = parseFloat(amount_paid) || 0;
const totalAmount = parseFloat(total_amount) || 0;

const updatedPaid = previousPaid + amountPaid;
const remaining_amount = totalAmount - updatedPaid;

console.log("previousPaid:", previousPaid);
console.log("amountPaid:", amountPaid);
console.log("updatedPaid:", updatedPaid);
console.log("remaining_amount:", remaining_amount);
    // Step 2: Insert the new payment
    const insertQuery = `
      INSERT INTO payment_table 
      (payment_mode, payment_date, remarks, bill_no, discount, total_amount, remaining_amount, amount_paid, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [
        payment_mode,
        payment_date,
        remarks,
        bill_no,
        discount,
        total_amount,
        remaining_amount,
        amount_paid,
        status,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting payment:", err);
          return res.status(500).json({ error: err });
        }

        res.json({
          message: "Payment added successfully",
          paymentId: result.insertId,
          total_paid: updatedPaid,
          remaining_amount: remaining_amount,
        });
      }
    );
  });
};

const getpaymentByBillNo = (req, res) => {
  const bill_no = req.params.bill_no;

  db.query(
    "SELECT * FROM payment_table WHERE bill_no = ?",
    [bill_no],
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("Error fetching payments:", err);
        return res.status(500).json({ error: err });
      }

      if (result.length === 0) {
        return res.json({ result: [], message: "No payments found" });
        // return res.status(404).json({ message: "No payments found" });
      }

      // Format dates for all invoices
      res.json({ result });
    }
  );
};

const getpaymentById = (req, res) => {
  const payment_id = req.params.id;

  db.query(
    "SELECT * FROM payment_table WHERE payment_id = ?",
    [payment_id],
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("Error fetching payments:", err);
        return res.status(500).json({ error: err });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No payments found" });
      }

      // Format dates for all invoices
      res.json({ result });
    }
  );
};

const getPayments = (req, res) => {
  const { startDate, endDate, paymentStatus, customer } = req.query;

  let query = `
        SELECT 
            p.*,
            i.bill_date,
            c.customer_name
        FROM payment_table p
        LEFT JOIN invoice_table i ON p.bill_no = i.bill_no
        LEFT JOIN order_table o ON i.order_no = o.order_no
        LEFT JOIN customer_table c ON o.customer_id = c.customer_id
        WHERE 1=1
    `;

  const queryParams = [];

  if (startDate) {
    query += ` AND p.payment_date >= ?`;
    queryParams.push(startDate);
  }

  if (endDate) {
    query += ` AND p.payment_date <= ?`;
    queryParams.push(endDate);
  }

  if (paymentStatus) {
    query += ` AND p.status = ?`;
    queryParams.push(paymentStatus);
  }

  if (customer) {
    query += ` AND c.customer_name LIKE ?`;
    queryParams.push(`%${customer}%`);
  }

  query += ` ORDER BY p.payment_date DESC`;

  console.log("Executing payments query:", query);
  console.log("Query parameters:", queryParams);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching payments:", err);
      return res.status(500).json({ error: err });
    }
    console.log("Payments results:", results);
    res.json({ payments: results });
  });
};

module.exports = {
  addpayment,
  getpaymentByBillNo,
  getpaymentById,
  getPayments,
};
