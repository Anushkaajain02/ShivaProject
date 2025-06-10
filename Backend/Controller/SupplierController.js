const db = require("../db");
const addsupplier = (req, res) => {
  console.log("Received data:", req.body);

  const {
    supplier_name,
    contact_info,
    address,
    bank_name,
    account_number,
    ifsc_code,
    branch,
    gst_no,
  } = req.body;

  const query = `
    INSERT INTO supplier_table 
    (supplier_name, contact_info, address, bank_name, account_number, ifsc_code, branch, gst_no)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      supplier_name,
      contact_info,
      address,
      bank_name,
      account_number,
      ifsc_code,
      branch,
      gst_no,
    ],
    (err, result) => {
      if (err) {
        console.error("🔥 SQL Error:", err);
        return res.status(500).json({ error: err });
      }

      // ✅ Only send success response if no error
      return res.status(201).json({
        message: "Supplier Added",
        supplierId: result.insertId,
      });
    }
  );
};


const getsupplier = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  // First, get total count
  db.query(
    "SELECT COUNT(*) AS count FROM supplier_table",
    (err, countResult) => {
      if (err) {
        console.error("Error counting suppliers:", err);
        return res.status(500).json({ error: err });
      }

      const total = countResult[0].count;

      // Now, get paginated results
      db.query(
        "SELECT * FROM supplier_table LIMIT ? OFFSET ?",
        [limit, offset],
        (err, data) => {
          if (err) {
            console.error("Error fetching paginated suppliers:", err);
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
    }
  );
};

const GetSupplierById = (req, res) => {
  const supplierId = req.params.id; // Or req.params.company_id, based on your route

  db.query(
    "SELECT * FROM supplier_table WHERE supplier_id = ?",
    [supplierId],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching Supplier by ID:", err);
        return res.status(500).json({ error: "Error fetching Supplier by ID" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      console.log("✅ Supplier Detail fetched:", results[0]);
      res.status(200).json(results[0]);
    }
  );
};

const updatesupplier = (req, res) => {
  console.log("Received data for update:", req.body);

  const {
    supplier_name,
    contact_info,
    address,
    bank_name,
    account_number,
    ifsc_code,
    branch,
    gst_no,
  } = req.body;
  const supplierId = req.params.id; // assuming the ID is passed as a route param

  db.query(
    "UPDATE supplier_table SET supplier_name = ?, contact_info = ?, address = ?, bank_name = ?, account_number = ?, ifsc_code = ?, branch = ?, gst_no = ? WHERE supplier_id = ?",
    [
      supplier_name,
      contact_info,
      address,
      bank_name,
      account_number,
      ifsc_code,
      branch,
      gst_no,
      supplierId,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      res.json({ message: "Supplier updated successfully" });
    }
  );
};

const deletesupplier = (req, res) => {
  const supplierId = req.params.id;

  db.query(
    "DELETE FROM supplier_table WHERE supplier_id = ?",
    [supplierId],
    (err, result) => {
      if (err) {
        console.error("Error deleting Supplier:", err);
        return res.status(500).json({ error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      console.log("Supplier deleted successfully");
      res.json({ message: "Supplier deleted successfully" });
    }
  );
};

module.exports = {
  addsupplier,
  getsupplier,
  deletesupplier,
  updatesupplier,
  GetSupplierById,
};
