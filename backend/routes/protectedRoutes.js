// backend/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

router.get('/dashboard', authenticate, (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user,
  });
});

module.exports = router;
