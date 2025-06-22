const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', userController.getAll);
router.post('/', upload.single('foto'), userController.create);
router.put('/:id', upload.single('foto'), userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
