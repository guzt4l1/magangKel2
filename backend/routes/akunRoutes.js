const express = require('express');
const router = express.Router();
const akunController = require('../controllers/akunController');

// Ambil semua akun
router.get('/', akunController.getAll);

// Ambil akun berdasarkan ID
router.get('/:id', akunController.getById);

// Tambah akun
router.post('/', akunController.create);

// Update akun
router.put('/:id', akunController.update);

// Hapus akun
router.delete('/:id', akunController.remove);

module.exports = router;
