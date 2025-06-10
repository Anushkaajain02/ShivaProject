const db = require("../db");

const getuser = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // First, get total count
  db.query("SELECT COUNT(*) AS count FROM user_table", (err, countResult) => {
    if (err) {
      console.error("Error counting company:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    // Now, get paginated results
    db.query(
      "SELECT * FROM user_table LIMIT ? OFFSET ?",
      [limit, offset],
      (err, data) => {
        if (err) {
          console.error("Error fetching paginated company:", err);
          return res.status(500).json({ error: err });
        }

        res.json({
          total,
          page,
          limit,
          data,
        });
      }
    );
  });
};

const updateuserstatus = (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ message: "Missing userstatus in body" });
  }

  const query = "UPDATE user_table SET status = ? WHERE user_id = ?";

  db.query(query, [status, userId], (err, result) => {
    if (err) {
      console.error("Error updating user status:", err);
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User status updated successfully" });
  });
};

const GetUserByEmail = (req, res) => {
  const userEmail = req.params.email;

  db.query(
    "SELECT * FROM user_table WHERE email = ?",
    [userEmail],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching User by Email:", err);
        return res.status(500).json({ error: "Error fetching User by Email:" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("✅ User Detail fetched:", results[0]);
      res.status(200).json(results[0]);
    }
  );
};

module.exports = { getuser, updateuserstatus, GetUserByEmail };
