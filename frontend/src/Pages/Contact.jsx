import React, { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaCommentDots,
  FaPhone,
  FaMapMarkerAlt,
  FaTruck,
  FaUndoAlt,
  FaHeadset,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { sendContact } from "../services/api";
import Swal from "sweetalert2";

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitted, setSubmitted] = useState(false);

  // Validation
  const validate = () => {
    let newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Only letters and spaces are allowed.";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Message
    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (form.message.length > 500) {
      newErrors.message = "Message cannot exceed 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    // Remove error while typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Details",
        text: "Please correct the highlighted fields.",
        width: "380px",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContact(form);

      await Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been sent successfully.",
        width: "350px",
        confirmButtonColor: "#198754",
      });

      setForm({
        name: "",
        email: "",
        message: "",
      });

      setErrors({});
      // setSubmitted(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to send message. Please try again.",
        width: "350px",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">
        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card shadow border-0 p-4">
            <h3 className="text-primary mb-3">📩 Contact Support</h3>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="fw-bold">
                  <FaUser className="me-2" />
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="fw-bold">
                  <FaEnvelope className="me-2" />
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Message */}
              <div className="mb-3">
                <label className="fw-bold">
                  <FaCommentDots className="me-2" />
                  Message
                </label>

                <textarea
                  rows="4"
                  name="message"
                  className={`form-control ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                ></textarea>

                <small className="text-muted">
                  {form.message.length}/500 characters
                </small>

                {errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6">
          <div className="card shadow border-0 p-4 bg-light h-100">
            <h4 className="mb-3 text-success">🛒 Customer Help Center</h4>

            <p>
              <FaPhone className="me-2" />
              +91 12345 67890
            </p>

            <p>
              <FaMapMarkerAlt className="me-2" />
              Mumbai, India
            </p>

            <hr />

            <ul className="list-unstyled">
              <li className="mb-3">
                <FaTruck className="me-2 text-primary" />
                Track your order
              </li>

              <li className="mb-3">
                <FaUndoAlt className="me-2 text-danger" />
                Returns & Refunds
              </li>

              <li className="mb-3">
                <FaHeadset className="me-2 text-warning" />
                Help & Support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
