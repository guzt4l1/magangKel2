const express = require('express');
const router = express.Router();
const controller = require('../controllers/pendapatanDimukaController');

router.get('/', controller.getAllPendapatanDimuka);
router.get('/:id', controller.getPendapatanDimukaById);
router.post('/', controller.createPendapatanDimuka);
router.put('/:id', controller.updatePendapatanDimuka);
router.delete('/:id', controller.deletePendapatanDimuka);

module.exports = router;
