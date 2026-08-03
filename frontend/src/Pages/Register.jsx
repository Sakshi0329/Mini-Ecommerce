import React, { useState } from "react";
import { registerUser, verifyOTP } from "../services/api"; // verifyOTP import kiya
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // 🌟 OTP flow control karne ke liye states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Allow only letters in name
    if (name === "name") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    // Allow only digits in phone
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };
  const validateForm = () => {
    let newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    // Phone
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters";
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
  // 1. Handle Registration Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please correct the highlighted fields.",
        width: "350px",
        confirmButtonColor: "#f39c12",
      });
      return;
    }
    setLoading(true);
    console.log("Form data", formData);

    try {
      const res = await registerUser(formData);
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text:
          res.data?.msg ||
          "Registration successful! Please check your email for the OTP.",
        width: "350px",
        confirmButtonColor: "#198754",
      });
      setIsOtpSent(true); // 🌟 Form hide karke OTP input dikhane ke liye
    } catch (err) {
      console.error("Backend error", err.response?.data);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.msg || "Something went wrong.",
        width: "350px",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Verification Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter a valid 6-digit OTP.",
        width: "350px",
        confirmButtonColor: "#f39c12",
      });
      return;
    }
    setLoading(true);

    try {
      const res = await verifyOTP({ email: formData.email, otp });
      Swal.fire({
        icon: "success",
        title: "Verified",
        text: res.data?.msg || "Email verified successfully!",
        width: "350px",
        confirmButtonColor: "#198754",
      }).then(() => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        navigate("/login");
      });

      // if (res.data.token) {
      //   localStorage.setItem("token", res.data.token);
      //   localStorage.setItem("user", JSON.stringify(res.data.user));
      // }

      navigate("/login");
    } catch (err) {
      console.error("OTP verification error", err.response?.data);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.msg || "Invalid OTP.",
        width: "350px",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* 🌟 Conditional Rendering: Agar OTP nahi gaya hai toh Registration Form dikhao */}
      {!isOtpSent ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Create Account</h2>
          <div className="mb-2">
            <div className="text-center mb-3">
              {/* Fixed Image Container */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  margin: "0 auto 15px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  background: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: "45px",
                      color: "#666",
                    }}
                  >
                    👤
                  </span>
                )}
              </div>

              <label
                htmlFor="profileImage"
                className="btn btn-outline-primary btn-sm"
                style={{
                  cursor: "pointer",
                  width: "180px",
                }}
              >
                📷 Choose Profile Photo
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </div>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-2">
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div className="mb-2">
            <input
              type="tel"
              name="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="10 Digit Mobile Number"
              value={formData.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          {/* Address */}
          <div className="mb-2">
            <textarea
              rows="3"
              name="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter Full Address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <input
              type="password"
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}

            <small className="text-muted">
              Password must contain at least one letter, one number and one
              special character.
            </small>
          </div>

          <button type="submit" className="green-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Register Now"}
          </button>
          <div className="text-center mt-2">
            <small className="text-muted">
              Already have an account?{" "}
              <span
                className="text-bold fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </small>
          </div>
        </form>
      ) : (
        /* 🌟 Agar OTP send ho chuka hai toh ye OTP box dikhega */
        <form onSubmit={handleOtpSubmit} className="auth-form">
          <h2>Verify Your Email</h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            We've sent a 6-digit OTP to<strong>{formData.email}</strong> par
          </p>

          <input
            type="text"
            name="otp"
            placeholder="Enter 6-Digit OTP"
            maxLength="6"
            pattern="[0-9]{6}"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{
              textAlign: "center",
              fontSize: "20px",
              letterSpacing: "4px",
            }}
          />

          <button type="submit" className="green-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Register"}
          </button>

          <button
            type="button"
            className="text-btn"
            onClick={() => setIsOtpSent(false)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            ← Back to Edit Details
          </button>
          {/* <div className="text-center mt-4">
            <small className="text-muted">Didn't receive the OTP?</small>

            <br />

            <button
              type="button"
              className="btn btn-link text-decoration-none fw-semibold"
              onClick={handleSubmit}
              disabled={loading}
            >
              Resend OTP
            </button>
          </div> */}
        </form>
      )}
    </div>
  );
};

export default Register;
