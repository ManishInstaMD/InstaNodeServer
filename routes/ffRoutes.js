const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadHandler } = require("../controller/ffController");

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}_${file.originalname.replace(/[<>:"/\\|?*]/g, "_")}`;
    cb(null, safeName);
  },
});

const ALLOWED_MIME_TYPES = [
  "video/mp4", "video/quicktime", "video/x-msvideo",
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).fields([
  { name: "video", maxCount: 1 },
  { name: "background", maxCount: 1 },
]);

router.post("/upload", (req, res) => {
  upload(req, res, (err) => uploadHandler(req, res, err));
});

module.exports = router;
