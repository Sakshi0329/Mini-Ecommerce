import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Image uploaded successfully",
      filename: req.file.filename,
      path: `../assets/img/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
