import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/Context";
import "./Login.css"; // Import custom styles

export default function Login() {
  const auth = useContext(AuthContext);

  if (!auth) {
    console.error("AuthContext is not provided!");
    return <div>Error: AuthContext is missing!</div>;
  }

  const { setUser } = auth;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://music-palyer.onrender.com/api/auth/login", formData);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setUser({ token });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card shadow-lg p-4">
        <h2 className="text-center text-light fw-bold mb-4">🔐 Welcome Back!</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-bold">
            Login
          </button>
        </form>

        <p className="text-center text-light mt-3">
          Don't have an account?{" "}
          <a href="/signup" className="text-decoration-none text-info">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
