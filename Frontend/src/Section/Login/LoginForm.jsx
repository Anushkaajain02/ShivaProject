import React, { useState } from "react";
import "./UserForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3301/UserLogin", formData);
      alert("✅ User Login");

      localStorage.setItem("token", res.data.token);

      const userDetailsResponse = await axios.get(
        `http://localhost:3301/GetUserByEmail/${formData.email}`
      );

      localStorage.setItem(
        "userDetails",
        JSON.stringify(userDetailsResponse.data)
      );

      navigate("/Dashboard");
    } catch (err) {
      console.error(" Error:", err.response?.data || err.message);
      alert("❌ " + (err.response?.data?.message || "User Not Logged in"));
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ padding: "19px" }}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ padding: "19px" }}
            placeholder="Enter your password"
            required
          />
        </div>
        <p
          style={{ marginTop: "10px", fontSize: "14px", textAlignLast: "end" }}
        >
          Don&rsquo;t have an account?{" "}
          <span
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/userregister")}
          >
            Sign up
          </span>
        </p>
        <button type="submit" className="auth-button primary-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
