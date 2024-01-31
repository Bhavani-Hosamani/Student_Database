import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DownloadTableExcel } from "react-export-table-to-excel";

function Student() {
  const [rollnumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [students, setStudents] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const tableRef = useRef(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();
  const openModal = () => {
    setToggleModal(true);
  };

  const getAllStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getstudents");
      setStudents(response?.data.values);
    } catch (error) {
      console.log(error);
    }
  };

  const searchInputHandler = () => {
    if (searchInput.length === 0) {
      return setFilteredStudents(students);
    }
    const filteredEmployees = students?.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.email.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
    setFilteredStudents(filteredEmployees);
  };

  const submitForm = async () => {
    setToggleModal(false);
    try {
      const response = await axios.post("http://localhost:5000/addstudents", {
        rollnumber: rollnumber,
        name: name,
        email: email,
        phonenumber: phonenumber,
      });
      if (response) {
        getAllStudents();
        setName("");
        setRollNumber("");
        setEmail("");
        setPhoneNumber("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  useEffect(() => {
    searchInputHandler();
  }, [searchInput, students]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center outer-wrapper">
      <div className="w-50 bg-white rounded p-3">
        <div
          style={{
            position: "absolute",
            top: 4,
            right: "8px",
            margin: "8px",
          }}
        >
          <button
            onClick={logoutHandler}
            className="btn btn-danger w-100 rounded-0 "
          >
            Logout
          </button>
        </div>
        <p
          className="d-flex justify-content-center mb-2"
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            borderBottom: "1px solid grey",
            paddingBottom: "4px",
          }}
        >
          Student Information
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <button
              className="btn mb-2 mt-1"
              style={{ backgroundColor: "green", color: "white" }}
              onClick={openModal}
            >
              Add <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div>
            <DownloadTableExcel
              filename="users table"
              sheet="users"
              currentTableRef={tableRef.current}
            >
              <button className="btn btn-danger ">
                Export <i className="fa-solid fa-download"></i>
              </button>
            </DownloadTableExcel>
          </div>
        </div>
        <table className="table" ref={tableRef} style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents?.map((student, index) => (
              <tr key={index}>
                <td>{student.rollnumber}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phonenumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {searchInput.length > 0 && filteredStudents.length < 1 && (
          <p style={{ textAlign: "center" }}>
            No Student Exists with name{" "}
            <strong>
              <span style={{ color: "red" }}>{searchInput}</span>{" "}
            </strong>
          </p>
        )}
      </div>

      {toggleModal === true && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            top: 0,
            left: 0,
            zIndex: 100,
            right: 0,
            bottom: 0,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              position: "absolute",
              top: "0",
              left: "50%",
              width: "30%",
              transform: "translate(-50%, 50%)",
              padding: 30,
              borderRadius: 10,
            }}
          >
            <p
              style={{
                display: "flex",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              Add Student
            </p>
            <p
              style={{
                position: "absolute",
                top: 9,
                right: 10,
                backgroundColor: "red",
                color: "white",
                borderRadius: "4px",
                padding: "2px 7px",
                cursor: "pointer",
              }}
              onClick={closeModal}
            >
              X
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                marginBottom: 15,
              }}
            >
              <input
                type="text"
                placeholder="Roll Number"
                value={rollnumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
              <br />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <input
                type="number"
                placeholder="Phone Number"
                value={phonenumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button className="btn btn-success" onClick={submitForm}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Student;
