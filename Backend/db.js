const mysql = require("mysql2");

const connectdb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ordermanagementsystem",
  port: 3306,
});

// Establish the DB connection

connectdb.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = connectdb;
