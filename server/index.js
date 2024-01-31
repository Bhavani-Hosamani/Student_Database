const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "crud",
  port: "5432",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/addstudents", async (req, res) => {
  const { rollnumber, name, email, phonenumber } = req.body;

  if (!rollnumber || !name || !email || !phonenumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO student (rollnumber, name, email, phonenumber) VALUES ($1, $2, $3, $4)";

  const values = [rollnumber, name, email, phonenumber];

  try {
    const result = await db.query(sql, values);
    console.log("Student added to the database", result);
    return res
      .status(200)
      .json({ message: "Student added to the database", result });
  } catch (error) {
    console.error("Error inserting student:", error);
    return res.status(500).json({ error: "Error inserting student" });
  }
});

app.get("/getstudents", async (req, res) => {
  try {
    const { rows: results } = await db.query("SELECT * FROM student");

    console.log("Students selected from the database");
    return res.status(200).json({
      message: "Students selected from the database",
      values: results,
    });
  } catch (err) {
    console.error("Error selecting students:", err);
    return res.status(500).json({ error: "Error selecting students" });
  }
});

app.post("/signup", async (req, res) => {
  // console.log("hello");
  try {
    const sql = "INSERT INTO login (name, email, password) VALUES ($1, $2, $3)";
    const values = [req.body.name, req.body.email, req.body.password];

    await db.query(sql, values);
    console.log("User added to the database");
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error inserting user:", error);
    return res
      .status(500)
      .json({ status: "failed", error: "Error inserting user" });
  }
});

app.post("/login", (req, res) => {
  // console.log("hii");
  const sql = "SELECT * FROM login WHERE email=$1 AND password=$2";
  let data; // Declare a variable to store the result

  db.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    data = result.rows;

    if (data.length > 0) {
      // console.log("success");
      return res.json({ status: "success", user: data[0] });
    } else {
      return res.json({ status: "failed", error: "Invalid credentials" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
