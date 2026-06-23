const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dhp70wj2124li.cloudfront.net",
    "http://employee-frontend-bucket-new.s3-website-us-east-1.amazonaws.com/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("MySQL connected");
  }
});

app.get("/", (req, res) => {
  res.send("Employee API running");
});

// Get all employees
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add employee
app.post("/employees", (req, res) => {
  const { name, email, role, salary } = req.body;

  const sql = "INSERT INTO employees (name, email, role, salary) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, role, salary], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee added successfully", id: result.insertId });
  });
});

// Update employee
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role, salary } = req.body;

  const sql = "UPDATE employees SET name=?, email=?, role=?, salary=? WHERE id=?";
  db.query(sql, [name, email, role, salary, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee updated successfully" });
  });
});

// Delete employee
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM employees WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Employee deleted successfully" });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
