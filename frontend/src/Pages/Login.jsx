import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain at least one letter, one number and one special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Details",
        text: "Please enter a valid email and password.",
        width: "350px",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      const { data } = await loginUser(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user._id || data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome, ${data.user.name}!`,
        width: "350px",
        padding: "1.5rem",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/");
      window.location.reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.msg || "Invalid email or password.",
        width: "350px",
        padding: "1.5rem",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <div className="main-container">
      {" "}
      {}
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to Your Account</h2>
        <div className="mb-2">
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="mb-2">
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
          {/* 
          <small className="text-muted">
            Password must contain at least one letter, one number and one
            special character.
          </small> */}
        </div>
        <button type="submit" className="green-btn">
          Login Now
        </button>
        <div className="text-center mt-4">
          <small className="text-muted">
            Don't have an account?{" "}
            <span
              className="fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </small>
        </div>
      </form>
    </div>
  );
};

export default Login;
