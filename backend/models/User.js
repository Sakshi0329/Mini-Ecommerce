import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Please enter an email"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be at least 6  characters long"],
    },

    phone: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [10, "Phone number must be 10 digits"],
      maxlength: [10, "Phone number exceed 10 digits"],
    },

    address: {
      type: String,
      required: [true, "Please enter your full delivery address"],
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
