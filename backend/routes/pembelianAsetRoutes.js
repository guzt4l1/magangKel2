const express = require('express');
const router = express.Router();
const controller = require('../controllers/pembelianAsetController');

router.get('/', controller.getAllPembelianAset);
router.get('/:id', controller.getPembelianAsetById);
router.post('/', controller.createPembelianAset);
router.put('/:id', controller.updatePembelianAset);
router.delete('/:id', controller.deletePembelianAset);

module.exports = router;
