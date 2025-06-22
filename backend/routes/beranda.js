const express = require('express');
const router = express.Router();
const controller = require('../controllers/berandaController');

router.get('/', controller.getDashboardData);

module.exports = router;
