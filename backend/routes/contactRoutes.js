import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
} from "../controllers/contactController.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();
// POST
router.post("/", auth, createContact);

// GET (Admin Only)
router.get("/", auth, admin, getAllContacts);
router.delete("/:id", auth, admin, deleteContact);
export default router;
