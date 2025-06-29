const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi untuk memastikan folder tujuan ada
const ensureDirExist = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Atur penyimpanan dinamis berdasarkan rute atau tujuan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = `public/uploads/${req.baseUrl.split('/').pop()}`;
    ensureDirExist(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});

// Filter hanya file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValid = allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
