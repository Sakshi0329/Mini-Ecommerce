import express from "express";
import {
  getProfile,
  login,
  register,
  updateProfile,
  verifyOTP,
} from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.get("/profile", auth, getProfile);

router.put("/profile", auth, updateProfile);

export default router;
