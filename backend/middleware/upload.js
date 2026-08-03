import multer from "multer";
import path from "path";
import fs from "fs";

const BASE_UPLOAD_PATH = path.join(
  process.cwd(),
  "../../EKODEX_CMS/frontend",
  "assets",
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    const ext = path.extname(file.originalname).toLowerCase();

    if (
      [".jpg", ".jpeg", ".png", ".webp", ".gif", ".csv", ".jfif"].includes(ext)
    ) {
      folder = "img";
    } else if (ext === ".csv" || ext === ".xlsx") {
      folder = "csv";
    }

    const uploadPath = path.join(BASE_UPLOAD_PATH, folder);

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedExts = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".csv",
      ".jfif",
      ".xlsx",
    ];

    // 2. Added the modern Excel MIME type here
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Modern Excel
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExts.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(`Extension ${ext} or MIME ${file.mimetype} is not allowed.`),
      );
    }
  },
});
