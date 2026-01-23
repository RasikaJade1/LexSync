const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log('Created uploads/ folder');
}

// Disk storage for temp files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);  // Use absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Unique name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },  // 100MB
  fileFilter: (req, file, cb) => {
    cb(null, true);  // Accept all
  },
});

module.exports = upload;