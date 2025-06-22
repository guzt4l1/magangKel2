const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Koneksi frontend-backend berhasil!' });
});

module.exports = router;
