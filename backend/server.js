import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import User from "./models/User.js";
import authMiddleware from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import connectDB from "./config/db.js";
dotenv.config();
import transporter from "./config/nodemailer.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://mini-ecommerce-frontend-git3.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --- 2. Database Connection ---
connectDB();

// Order Notification Route
app.post("/api/order-notify", async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      customerName,
      customerAddress,
      customerPhone,
      customerEmail,
    } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `🔥 New Order: ${productName}`,
      html: `
        <div style="font-family: Arial; border: 1px solid #ddd; padding: 20px;">
          <h2>New Order Details</h2>
          <p><strong>Product:</strong> ${productName} (₹${productPrice})</p>
          <hr/>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail || "N/A"}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Address:</strong> ${customerAddress}</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "Email Sent!",
    });
  } catch (err) {
    console.error("Nodemailer Error:", err);

    res.status(500).json({
      msg: "Backend Error",
      error: err.message,
    });
  }
});

// Main Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("<h1>Luxora Backend is Running!</h1>");
});

// --- 5. Port Setting ---
const PORT = process.env.PORT || 2600;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
