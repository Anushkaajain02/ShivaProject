import React, { useState, useEffect } from "react";
import "./UserForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const getRoleName = (role) => {
  const roleNames = {
    1: "Manager",
    2: "Accountant",
    3: "Sales Representative",
  };
  return roleNames[role] || "User";
};
const RegisterForm = ({}) => {
  const { role } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    contactno: "",
    role: "0",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role: role }));
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3301/UserRegister", formData);
      alert("✅ User Added");
      navigate("/");
    } catch (err) {
      console.error(" Error:", err.response?.data || err.message);
      alert("❌ " + (err.response?.data?.sqlMessage || "User Not Added"));
    }
    // TODO: Implement registration logic here
    console.log("Registration form submitted:", formData);
  };

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        style={{ height: "750px", width: "60%" }}
      >
        <h2>Register {getRoleName(role)}</h2>
        <div className="form-row" style={{ marginBottom: "0rem" }}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              type="tel"
              id="contact"
              name="contactno"
              value={formData.contactno}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ height: "3.7rem" }}
            required
          >
            <option value="0">Admin</option>
            <option value="1">Manager</option>
            <option value="2">Accountant</option>
            <option value="3">Sales Representative</option>
          </select>
        </div>

        <button
          type="submit"
          className="auth-button primary-button"
          style={{ padding: "0.5rem", marginLeft: "179px" }}
        >
          Create Account
        </button>
        <button
          type="button"
          className="auth-button secondary-button"
          style={{ padding: "0.5rem" }}
          onClick={() => navigate("/")}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
