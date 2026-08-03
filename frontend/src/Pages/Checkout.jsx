import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../services/api";
import Swal from "sweetalert2";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",

    upiId: "",
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Name
    if (name === "fullName") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    // Phone
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    // City
    if (name === "city") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    // State
    if (name === "state") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    // Pincode
    if (name === "pincode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }

    // Card Number
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }

    // Card Holder
    if (name === "cardHolder") {
      value = value.replace(/[^A-Za-z ]/g, "");
    }

    // CVV
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

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

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
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
    if (!formData.phone.trim()) {
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

    // City
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Pincode
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    // Payment
    if (!["COD", "UPI", "Card"].includes(formData.payment)) {
      newErrors.payment = "Please select a payment method";
    }

    // UPI
    if (formData.payment === "UPI") {
      if (!formData.upiId.trim()) {
        newErrors.upiId = "UPI ID is required";
      } else if (!/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(formData.upiId)) {
        newErrors.upiId = "Enter a valid UPI ID";
      }
    }

    // Card
    if (formData.payment === "Card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!formData.cardHolder.trim()) {
        newErrors.cardHolder = "Card holder name is required";
      }

      if (!formData.expiry) {
        newErrors.expiry = "Expiry date is required";
      }

      if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3 digits";
      }
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
        text: "Please correct the highlighted fields before placing the order.",
        width: "350px",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Cart Empty",
          text: "Your cart is empty.",
          width: "350px",
          confirmButtonColor: "#198754",
        });
        return;
      }

      const products = cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
      }));

      const totalAmount = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const orderData = {
        products,

        shippingAddress: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        },

        paymentMethod: formData.payment,

        paymentDetails:
          formData.payment === "UPI"
            ? {
                upiId: formData.upiId.trim(),
              }
            : formData.payment === "Card"
              ? {
                  cardHolder: formData.cardHolder.trim(),
                  cardNumber: formData.cardNumber,
                  expiry: formData.expiry,
                  cvv: formData.cvv,
                }
              : {},

        totalAmount,
      };

      console.log(orderData);

      await placeOrder(orderData);
      await Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been placed successfully.",
        width: "350px",
        confirmButtonColor: "#198754",
      });

      localStorage.removeItem("cart");

      navigate("/");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text:
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Something went wrong while placing the order.",
        width: "350px",
        confirmButtonColor: "#dc3545",
      });
    }
  };
  return (
    <div className="container-fluid px-5 py-5">
      <h2 className="fw-bold mb-4 text-center">Checkout</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Shipping Details</h4>

                <div className="row">
                  {/* Full Name */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Full Name</label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.fullName ? "is-invalid" : ""
                      }`}
                    />

                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />

                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                    />

                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Address */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>

                    <textarea
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                    />

                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  {/* City */}
                  <div className="col-md-2 mb-3">
                    <label className="form-label">City</label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.city ? "is-invalid" : ""
                      }`}
                    />

                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>

                  {/* State */}
                  <div className="col-md-2 mb-3">
                    <label className="form-label">State</label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.state ? "is-invalid" : ""
                      }`}
                    />

                    {errors.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>

                  {/* Pincode */}
                  <div className="col-md-2 mb-3">
                    <label className="form-label">Pincode</label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.pincode ? "is-invalid" : ""
                      }`}
                    />

                    {errors.pincode && (
                      <div className="invalid-feedback">{errors.pincode}</div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                {/* <div className="mb-3">
                  <label className="form-label">Payment Method</label>

                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    className={`form-select ${
                      errors.payment ? "is-invalid" : ""
                    }`}
                  >
                    <option value="COD">Cash On Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>

                  {errors.payment && (
                    <div className="invalid-feedback">{errors.payment}</div>
                  )}
                </div> */}
              </div>
            </div>
          </div>
          {/* RIGHT SIDE - Payment Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h4 className="mb-4">Payment Details</h4>

                {/* Payment Method */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Payment Method
                  </label>

                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    className={`form-select ${
                      errors.payment ? "is-invalid" : ""
                    }`}
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit /Debit Card</option>
                  </select>

                  {errors.payment && (
                    <div className="invalid-feedback">{errors.payment}</div>
                  )}
                </div>

                {/* COD */}
                {formData.payment === "COD" && (
                  <div className="card bg-light border">
                    <div className="card-body text-center">
                      <h5>Cash On Delivery</h5>
                      <p className="text-muted mb-0">
                        You will pay when your order is delivered.
                      </p>
                    </div>
                  </div>
                )}

                {/* UPI */}
                {formData.payment === "UPI" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">UPI ID</label>

                      <input
                        type="text"
                        name="upiId"
                        placeholder="example@upi"
                        value={formData.upiId}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.upiId ? "is-invalid" : ""
                        }`}
                      />

                      {errors.upiId && (
                        <div className="invalid-feedback">{errors.upiId}</div>
                      )}
                    </div>

                    <div className="card border-success bg-light">
                      <div className="card-body text-center">
                        <h6 className="text-success">Secure UPI Payment</h6>

                        <small className="text-muted">
                          Enter your UPI ID to continue.
                        </small>
                      </div>
                    </div>
                  </>
                )}

                {/* CARD */}
                {formData.payment === "Card" && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Card Number</label>

                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234567812345678"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.cardNumber ? "is-invalid" : ""
                        }`}
                      />

                      {errors.cardNumber && (
                        <div className="invalid-feedback">
                          {errors.cardNumber}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Card Holder</label>

                      <input
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        className={`form-control ${
                          errors.cardHolder ? "is-invalid" : ""
                        }`}
                      />

                      {errors.cardHolder && (
                        <div className="invalid-feedback">
                          {errors.cardHolder}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label">Expiry</label>

                        <input
                          type="month"
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          className={`form-control ${
                            errors.expiry ? "is-invalid" : ""
                          }`}
                        />

                        {errors.expiry && (
                          <div className="invalid-feedback">
                            {errors.expiry}
                          </div>
                        )}
                      </div>

                      <div className="col-6 mb-3">
                        <label className="form-label">CVV</label>

                        <input
                          type="password"
                          name="cvv"
                          maxLength="3"
                          value={formData.cvv}
                          onChange={handleChange}
                          className={`form-control ${
                            errors.cvv ? "is-invalid" : ""
                          }`}
                        />

                        {errors.cvv && (
                          <div className="invalid-feedback">{errors.cvv}</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <hr />

                <button type="submit" className="btn btn-success w-100 py-2">
                  {formData.payment === "COD"
                    ? "Place Order"
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
