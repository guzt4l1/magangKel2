const express = require('express');
const router = express.Router();
const controller = require('../controllers/pengeluaranKewajibanController');

router.get('/', controller.getAllPengeluaranKewajiban);
router.get('/:id', controller.getPengeluaranKewajibanById);
router.post('/', controller.createPengeluaranKewajiban);
router.put('/:id', controller.updatePengeluaranKewajiban);
router.delete('/:id', controller.deletePengeluaranKewajiban);

module.exports = router;
