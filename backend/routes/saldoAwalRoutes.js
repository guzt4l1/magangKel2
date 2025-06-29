//backend/routes/saldoAwalRoutes.js
const express = require('express');
const router = express.Router();
const saldoAwalController = require('../controllers/saldoAwalController');

router.get('/', saldoAwalController.getAll);
router.post('/', saldoAwalController.create);
router.put('/:id', saldoAwalController.update);
router.delete('/:id', saldoAwalController.remove);

module.exports = router;
