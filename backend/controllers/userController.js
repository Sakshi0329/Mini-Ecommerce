import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import transporter from "../config/nodemailer.js";
// ==========================
// 1. REGISTER FUNCTION (Generates & Sends OTP)
// ==========================
export const register = async (req, res) => {
  try {
    // console.log("Incoming Registration Data:", req.body);

    const { name, email, password, phone, address, profileImage } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ msg: "All fields must be filled out." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "User is already registered." });

    // 🌟 Password Validation Rule
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters long and include at least one digit (0-9) and one special character (!@#$%^&*).",
      });
    }

    // Generate OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password,
      phone,
      address,
      profileImage: profileImage || "",
      otp: generatedOTP,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    // console.log("Original Password:", password);

    const salt = await bcrypt.genSalt(10);
    // console.log("Salt:", salt);

    user.password = await bcrypt.hash(password, salt);
    // console.log("Hashed Password:", user.password);

    await user.save();
    // console.log("User Data Saved, Sending OTP...");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Luxora - Email Verification Code",
      text: `Hi ${name},\n\nYour OTP for registering on luxora is: ${generatedOTP}\n\nThis code is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP Sent Successfully to ${email}`);

    res.status(201).json({
      msg: "Registration successful! An OTP has been sent to your email.",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    console.error(err.stack);

    if (!res.headersSent) {
      return res.status(500).json({
        msg: "Server Error: " + err.message,
      });
    }
  }
};

// ==========================
// 2. VERIFY OTP FUNCTION
// ==========================
export const verifyOTP = async (req, res) => {
  try {
    console.log("📥 Incoming OTP Verification:", req.body);

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        msg: "Email and OTP are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        msg: "Invalid or expired OTP!",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    console.log("User Verified Successfully!");

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      msg: "Email verified successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("OTP Verification Error:", err.message);

    return res.status(500).json({
      msg: "Server Error: OTP verification failed",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpires",
    );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};
// ==========================
// 3. LOGIN FUNCTION
// ==========================
export const login = async (req, res) => {
  try {
    console.log("📥 Incoming Login Data:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and Password are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "This email is not registered.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        msg: "Your email is not verified. Please verify your OTP first!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Incorrect Password!",
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("User Logged In Successfully!");

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);

    if (!res.headersSent) {
      return res.status(500).json({
        msg: "Server Error: Login failed",
      });
    }
  }
};
