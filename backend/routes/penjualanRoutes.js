const express = require('express');
const router = express.Router();
const penjualanController = require('../controllers/penjualanController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', penjualanController.getAllPenjualan);
router.get('/:id', penjualanController.getPenjualanById);

// Tambahkan middleware upload
router.post('/', upload.single('bukti'), penjualanController.createPenjualan);
router.put('/:id', upload.single('bukti'), penjualanController.updatePenjualan);
router.delete('/:id', penjualanController.deletePenjualan);

module.exports = router;
