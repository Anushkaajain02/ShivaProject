const db = require("../db");

const addproduct = (req, res) => {
  console.log("Received data:", req.body);

  const { product_code, product_name, unit, category, price } = req.body;

  db.query(
    "INSERT INTO product_table (product_code, product_name, unit, category, price) VALUES (?, ?, ?, ?, ?)",
    [product_code, product_name, unit, category, price],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Product created", userId: result.insertId });
    }
  );
};

const getproduct = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  // First, get total count
  db.query("SELECT COUNT(*) AS count FROM product_table", (err, countResult) => {
    if (err) {
      console.error("Error counting product:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    // Now, get paginated results
    db.query("SELECT * FROM product_table LIMIT ? OFFSET ?", [limit, offset], (err, data) => {
      if (err) {
        console.error("Error fetching paginated product:", err);
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

const GetproductById = (req, res) => {
  const productId = req.params.id; // Or req.params.company_id, based on your route

  db.query("SELECT * FROM product_table WHERE product_id = ?", [productId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching product by ID:", err);
      return res.status(500).json({ error: "Error fetching product by ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }

    console.log("✅ product Detail fetched:", results[0]);
    res.status(200).json(results[0]);
  });
};

const updateproduct = (req, res) => {
  console.log("Received data for update:", req.body);

  const { product_code, product_name, unit, category, price } = req.body;
  const productId = req.params.id; // assuming the ID is passed as a route param

  db.query(
    "UPDATE product_table SET product_code = ? ,  product_name = ?, unit = ?, category = ?, price = ? WHERE product_id = ?",
    [product_code, product_name, unit, category, price, productId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "product not found" });
      }

      res.json({ message: "product updated successfully" });
    }
  );
};

const deleteproduct = (req, res) => {
  const productId = req.params.id;

  db.query("DELETE FROM product_table WHERE product_id = ?", [productId], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "product not found" });
    }
    console.log("product deleted successfully");
    res.json({ message: "product deleted successfully" });
  });
};

module.exports = { addproduct, getproduct, deleteproduct, updateproduct, GetproductById };
