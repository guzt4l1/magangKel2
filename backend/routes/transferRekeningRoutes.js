const express = require('express');
const router = express.Router();
const controller = require('../controllers/transferRekeningController');

router.get('/', controller.getAllTransferRekening);
router.get('/:id', controller.getTransferRekeningById);
router.post('/', controller.createTransferRekening);
router.put('/:id', controller.updateTransferRekening);
router.delete('/:id', controller.deleteTransferRekening);

module.exports = router;
