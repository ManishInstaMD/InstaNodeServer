const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadHandler } = require('../controller/ffController');
// const BASE_URL =  'http://localhost:5000';

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'image/jpeg', 'image/png', 'image/webp'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } 
});

// Temporary file upload endpoint
router.post('/upload-temp', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.video) {
      throw new Error('Video file is required');
    }

    const videoUrl = `/uploads/${req.files.video[0].filename}`;
    const backgroundUrl = `/uploads/${req.files.background[0].filename}`; 


    res.json({
      success: true,
      videoUrl,
      backgroundUrl
    });
  } catch (error) {
    // Cleanup uploaded files if error occurs
    if (req.files?.video) {
      fs.unlinkSync(req.files.video[0].path);
    }
    if (req.files?.background) {
      fs.unlinkSync(req.files.background[0].path);
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Video processing endpoint
router.get('/process', uploadHandler);

module.exports = router;