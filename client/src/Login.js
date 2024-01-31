import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios
      .post("http://localhost:5000/login", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.status === "success") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/");
        } else {
          alert("Incorrect Email and Password....");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Log-In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0 ">
            Log in
          </button>
          <p style={{ marginTop: "10px" }}>
            Don't have an account?{" "}
            <Link to="/signup">
              {" "}
              <strong>Signup</strong>
            </Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
