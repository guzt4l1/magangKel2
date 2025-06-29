const express = require('express');
const router = express.Router();
const controller = require('../controllers/penerimaanModalController');

// GET semua data
router.get('/', controller.getAllPenerimaanModal);

// GET data by ID
router.get('/:id', controller.getPenerimaanModalById);

// POST buat data baru
router.post('/', controller.createPenerimaanModal);

// PUT update data
router.put('/:id', controller.updatePenerimaanModal);

// DELETE hapus data
router.delete('/:id', controller.deletePenerimaanModal);

module.exports = router;
