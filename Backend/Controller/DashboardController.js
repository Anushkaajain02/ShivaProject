const db = require("../db");

const getDashboardStats = (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate().toString().padStart(2, "0");

    const todayStr = `${year}-${month}-${date}`;
    const monthStr = `${year}-${month}`;

    console.log("Fetching dashboard stats for:", { todayStr, monthStr });

    // Execute all queries in parallel
    Promise.all([
      // 1. Today's Orders
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) AS total 
           FROM order_table 
           WHERE DATE(created_at) = ?`,
          [todayStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 2. Today's Payments Received
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COALESCE(SUM(amount_paid), 0) AS total 
           FROM payment_table 
           WHERE DATE(payment_date) = ?`,
          [todayStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 3. Total Outstanding Payments (pending)
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COALESCE(SUM(remaining_amount), 0) AS total 
           FROM payment_table `,
          [],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 4. Today's Sales
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COALESCE(SUM(total_amount), 0) AS total 
           FROM order_table 
           WHERE DATE(created_at) = ?`,
          [todayStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 5. This Month's Orders
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COUNT(*) AS total 
           FROM order_table 
           WHERE DATE_FORMAT(created_at, '%Y-%m') = ?`,
          [monthStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 6. This Month's Payments
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COALESCE(SUM(amount_paid), 0) AS total 
           FROM payment_table 
           WHERE DATE_FORMAT(payment_date, '%Y-%m') = ?`,
          [monthStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 7. This Month's Sales
      new Promise((resolve, reject) => {
        db.query(
          `SELECT COALESCE(SUM(total_amount), 0) AS total 
           FROM order_table 
           WHERE DATE_FORMAT(created_at, '%Y-%m') = ?`,
          [monthStr],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),

      // 8. Number of Suppliers
      new Promise((resolve, reject) => {
        db.query(
          "SELECT COUNT(*) AS total FROM supplier_table",
          [],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0].total);
          }
        );
      }),
    ])
      .then(
        ([
          todayOrder,
          todayPaymentReceive,
          totalOutstandingPayment,
          todaySales,
          thisMonthOrder,
          thisMonthPaymentReceive,
          thisMonthSales,
          supplierCount,
        ]) => {
          const response = {
            todayOrder,
            todayPaymentReceive,
            totalOutstandingPayment,
            todaySales,
            thisMonthOrder,
            thisMonthPaymentReceive,
            thisMonthSales,
            supplierCount,
          };

          console.log("✅ Dashboard stats fetched successfully:", response);
          res.status(200).json(response);
        }
      )
      .catch((err) => {
        console.error("❌ Error fetching dashboard stats:", err);
        res.status(500).json({
          message: "Failed to fetch dashboard data",
          error: err.message,
          stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
      });
  } catch (err) {
    console.error("❌ Unexpected error in getDashboardStats:", err);
    res.status(500).json({
      message: "Unexpected error occurred",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

module.exports = { getDashboardStats };
