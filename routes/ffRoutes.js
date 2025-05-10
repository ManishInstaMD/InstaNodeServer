// file: routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const videoController = require("../controller/ffController");

const UPLOAD_LIMIT = "100MB";
const ALLOWED_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "imgage/jpg",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}_${file.originalname.replace(/[<>:"/\\|?*]/g, "_")}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only video and image files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD_LIMIT },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

router.post("/upload", (req, res) => upload(req, res, (err) => videoController.handleUpload(req, res, err)));

module.exports = router;