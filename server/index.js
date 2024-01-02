const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "crud",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post("/addstudents", async (req, res) => {
  const { rollNumber, name, email, phoneNumber } = req.body;

  if (!rollNumber || !name || !email || !phoneNumber) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO student (rollNumber, name, email, phoneNumber) VALUES (?, ?, ?, ?)";
  const values = [rollNumber, name, email, phoneNumber];

  try {
    const result = await db.promise().query(sql, values);
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
    const [results] = await db.promise().query("SELECT * FROM student");

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

// app.post("/signup", async (req, res) => {
//   try {
//     const sql = "INSERT INTO login (name,email,password) VALUES (?,?,?) ";
//     const values = [req.body.name, req.body.email, req.body.password];
//     db.query(sql, [values], (err, data) => {
//       if (err) {
//         return res.json("Error");
//       }
//       return res.json(data);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.post("/signup", async (req, res) => {
  try {
    const sql =
      "INSERT INTO login (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
      if (err) {
        return res.json("Error");
      }
      return res.json(data);
    });
  } catch (error) {
    console.log(error);
  }
});

// app.post("/login", (req, res) => {
//   const sql = "SELECT * FROM login WHERE 'email'=? AND 'password'=? ";

//   db.query(sql, [req.body.email, req.body.password], (err, data) => {
//     if (err) {
//       return res.json("Error");
//     }
//     if (data.length > 0) {
//       return res.json("success");
//     } else {
//       return res.json("failed");
//     }
//   });
// });

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE email=? AND password=?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("success");
    } else {
      return res.json("failed");
    }
  });
});

app.listen(5000, () => {
  console.log("listening");
});
