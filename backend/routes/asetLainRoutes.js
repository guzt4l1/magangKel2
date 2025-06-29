// routes/asetLainRoutes.js
const express = require('express');
const router = express.Router();
const asetLainController = require('../controllers/asetLainController');

router.get('/', asetLainController.getAllAsetLain);
router.post('/', asetLainController.createAsetLain);
router.put('/:id', asetLainController.updateAsetLain);
router.delete('/:id', asetLainController.deleteAsetLain);

module.exports = router;
