const mysql = require("mysql2");

const connectdb = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12784558",
  password: "8GLH73GmTA",
  database: "sql12784558",
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
