const express = require('express');
const router = express.Router();
const controller = require('../controllers/penghasilanLainController');

router.get('/', controller.getAllPenghasilanLain);
router.get('/:id', controller.getPenghasilanLainById);
router.post('/', controller.createPenghasilanLain);
router.put('/:id', controller.updatePenghasilanLain);
router.delete('/:id', controller.deletePenghasilanLain);

module.exports = router;
