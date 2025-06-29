// routes/pelangganRoutes.js

const express = require('express');
const router = express.Router();
const pelangganController = require('../controllers/pelangganController');

router.get('/', pelangganController.getAll);
router.post('/', pelangganController.create);
router.put('/:id', pelangganController.update);
router.delete('/:id', pelangganController.remove);

module.exports = router;
