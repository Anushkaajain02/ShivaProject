const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  const { username, email, password, address, contactno, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO user_table (username, email, password, address, contactno, role) VALUES (?, ?, ?,?,?,?)",
    [username, email, hashedPassword, address, contactno, role],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: "Database error" });
      }

      res.send({ message: "User registered successfully" });
    }
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user_table WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).send({ error: "DB error" });

      if (result.length === 0) {
        return res.status(401).send({ message: "Invalid Email or Password" });
      }

      const user = result[0];

      // ✅ Check if user is disabled (e.g., status = 0 or is_disabled = true)
      if (user.status === 0) {
        return res
          .status(403)
          .send({ message: "Account is disabled. Please contact support." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send({ message: "Invalid Email or Password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );

      res.send({ message: "Login successful", token });
    }
  );
};

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).send({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).send({ message: "Malformed token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

const profile = (req, res) => {
  res.send({ message: "Protected data accessed", user: req.user });
};

module.exports = { register, login, verifyToken, profile };
