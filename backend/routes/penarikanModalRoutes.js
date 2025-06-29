const express = require('express');
const router = express.Router();
const controller = require('../controllers/penarikanModalController');

router.get('/', controller.getAllPenarikanModal);
router.get('/:id', controller.getPenarikanModalById);
router.post('/', controller.createPenarikanModal);
router.put('/:id', controller.updatePenarikanModal);
router.delete('/:id', controller.deletePenarikanModal);

module.exports = router;
