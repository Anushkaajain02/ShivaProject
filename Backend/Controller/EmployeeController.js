const db = require("../db");
const dayjs = require("dayjs");

const addemployee = (req, res) => {
  console.log("Received data:", req.body);

  let { employee_name, designation, contact, joining_date } = req.body;

  // Format joining_date before inserting (assuming joining_date comes as 'YYYY-MM-DD' or similar)
  joining_date = dayjs(joining_date).format("YYYY-MM-DD");

  db.query(
    "INSERT INTO employee_table (employee_name, designation, contact, joining_date) VALUES (?, ?, ?, ?)",
    [employee_name, designation, contact, joining_date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "employee created", userId: result.insertId });
    }
  );
};

const getemployee = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) AS count FROM employee_table", (err, countResult) => {
    if (err) {
      console.error("Error counting employee:", err);
      return res.status(500).json({ error: err });
    }

    const total = countResult[0].count;

    db.query("SELECT * FROM employee_table LIMIT ? OFFSET ?", [limit, offset], (err, data) => {
      if (err) {
        console.error("Error fetching paginated employee:", err);
        return res.status(500).json({ error: err });
      }

      // Format joining_date in each record to avoid timezone shift
      const formattedData = data.map((emp) => ({
        ...emp,
        joining_date: dayjs(emp.joining_date).format("YYYY-MM-DD"), // or 'DD-MM-YYYY' if preferred
      }));

      res.json({
        total,
        page,
        limit,
        data: formattedData,
      });
    });
  });
};

const GetEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  db.query("SELECT * FROM employee_table WHERE employee_id = ?", [employeeId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching Employee by ID:", err);
      return res.status(500).json({ error: "Error fetching Employee by ID" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = results[0];
    employee.joining_date = dayjs(employee.joining_date).format("YYYY-MM-DD");

    console.log("✅ Employee Detail fetched:", employee);
    res.status(200).json(employee);
  });
};

const updateemployee = (req, res) => {
  console.log("Received data for update:", req.body);

  let { employee_name, designation, contact, joining_date } = req.body;
  const employeeId = req.params.id;

  // Format joining_date before update
  joining_date = dayjs(joining_date).format("YYYY-MM-DD");

  db.query(
    "UPDATE employee_table SET employee_name = ?, designation = ?, contact = ?, joining_date = ? WHERE employee_id = ?",
    [employee_name, designation, contact, joining_date, employeeId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "employee not found" });
      }

      res.json({ message: "employee updated successfully" });
    }
  );
};

const deleteemployee = (req, res) => {
  const employeeId = req.params.id;

  db.query("DELETE FROM employee_table WHERE employee_id = ?", [employeeId], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "employee not found" });
    }

    console.log("employee deleted successfully");
    res.json({ message: "employee deleted successfully" });
  });
};

module.exports = { addemployee, getemployee, deleteemployee, updateemployee, GetEmployeeById };
