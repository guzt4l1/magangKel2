const express = require('express');
const router = express.Router();
const controller = require('../controllers/pengeluaranBebanController');

// Endpoints
router.get('/', controller.getAllPengeluaranBeban);
router.get('/:id', controller.getPengeluaranBebanById);
router.post('/', controller.createPengeluaranBeban);
router.put('/:id', controller.updatePengeluaranBeban);
router.delete('/:id', controller.deletePengeluaranBeban);

module.exports = router;
