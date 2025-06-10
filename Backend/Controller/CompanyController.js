const db = require("../db");

const home = (req, res) => {
  res.status(200).send("I am using controller");
};

//------------------------------- Company Table -------------------------------

const addcompany = (req, res) => {
  console.log("Received data:", req.body);

  const { company_name, address, contact_info, gst_no, pan_no } = req.body;

  db.query(
    "INSERT INTO company_table (company_name, address, contact_info, gst_no, pan_no) VALUES (?, ?, ?, ?, ?)",
    [company_name, address, contact_info, gst_no, pan_no],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User created", userId: result.insertId });
    }
  );
};

const getcompany = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  // First, get total count
  db.query("SELECT COUNT(*) AS count FROM company_table", (err, countResult) => {
    if (err) {
      console.log(err);
      console.error("Error counting company:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    // Now, get paginated results
    db.query("SELECT * FROM company_table LIMIT ? OFFSET ?", [limit, offset], (err, data) => {
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
    });
  });
};

const GetCompanyById = (req, res) => {
  const companyId = req.params.id;

  db.query("SELECT * FROM company_table WHERE company_id = ?", [companyId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching Company by ID:", err);
      return res.status(500).json({ error: "Error fetching company by ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    console.log("✅ Company Detail fetched:", results[0]);
    res.status(200).json(results[0]);
  });
};

const updatecompany = (req, res) => {
  console.log("Received data for update:", req.body);

  const { company_name, address, contact_info, gst_no, pan_no } = req.body;
  const companyId = req.params.id; // assuming the ID is passed as a route param

  db.query(
    "UPDATE company_table SET company_name = ?, address = ?, contact_info = ?, gst_no = ?, pan_no = ? WHERE company_id = ?",
    [company_name, address, contact_info, gst_no, pan_no, companyId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json({ message: "Company updated successfully" });
    }
  );
};

const deletecompany = (req, res) => {
  const companyId = req.params.id;

  db.query("DELETE FROM company_table WHERE company_id = ?", [companyId], (err, result) => {
    if (err) {
      console.error("Error deleting company:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    console.log("Company deleted successfully");
    res.json({ message: "Company deleted successfully" });
  });
};

module.exports = { home, addcompany, getcompany, deletecompany, updatecompany, GetCompanyById };
