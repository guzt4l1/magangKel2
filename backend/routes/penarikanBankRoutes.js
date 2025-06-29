const express = require('express');
const router = express.Router();
const controller = require('../controllers/penarikanBankController');

// GET semua
router.get('/', controller.getAllPenarikanBank);

// GET berdasarkan ID
router.get('/:id', controller.getPenarikanBankById);

// POST
router.post('/', controller.createPenarikanBank);

// PUT
router.put('/:id', controller.updatePenarikanBank);

// DELETE
router.delete('/:id', controller.deletePenarikanBank);

module.exports = router;
