const express = require('express');
const router = express.Router();
const kategoriJasaController = require('../controllers/kategoriJasaController');

// ✅ Semua handler di sini harus fungsi yang valid
router.get('/', kategoriJasaController.getAll);
router.post('/', kategoriJasaController.create);
router.put('/:id', kategoriJasaController.update);
router.delete('/:id', kategoriJasaController.remove);

module.exports = router;
