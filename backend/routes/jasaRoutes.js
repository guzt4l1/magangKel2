const express = require('express');
const router = express.Router();
const jasaController = require('../controllers/jasaController');

router.get('/', jasaController.getAll);
router.post('/', jasaController.create);
router.put('/:id', jasaController.update);
router.delete('/:id', jasaController.remove);

module.exports = router;
