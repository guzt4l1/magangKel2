// routes/asetRoutes.js
const express = require('express');
const router = express.Router();
const asetController = require('../controllers/asetController');

router.get('/', asetController.getAllAset);
router.get('/:id', asetController.getAsetById);
router.post('/', asetController.createAset);
router.put('/:id', asetController.updateAset);
router.delete('/:id', asetController.deleteAset);

module.exports = router;