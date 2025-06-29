const express = require('express');
const router = express.Router();
const controller = require('../controllers/setoranBankController');

router.get('/', controller.getAllSetoranBank);
router.get('/:id', controller.getSetoranBankById);
router.post('/', controller.createSetoranBank);
router.put('/:id', controller.updateSetoranBank);
router.delete('/:id', controller.deleteSetoranBank);

module.exports = router;
