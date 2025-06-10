const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const app = express();
const PORT = 3301;
const dayjs = require("dayjs");
require("dotenv").config();

const userroutes = require("./Routes/UserRoutes");

dotenv.config();

// app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // React frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/", userroutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
