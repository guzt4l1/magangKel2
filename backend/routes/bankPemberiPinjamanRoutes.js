const express = require('express');
const router = express.Router();
const bankPemberiPinjamanController = require('../controllers/bankPemberiPinjamanController');

router.get('/', bankPemberiPinjamanController.getAll);
router.get('/:id', bankPemberiPinjamanController.getById);
router.post('/', bankPemberiPinjamanController.create);
router.put('/:id', bankPemberiPinjamanController.update);
router.delete('/:id', bankPemberiPinjamanController.remove);

module.exports = router;
