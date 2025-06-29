const express = require('express');
const router = express.Router();
const utangController = require('../controllers/utangController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', utangController.getAllUtang);
router.get('/:id', utangController.getUtangById);
router.post('/', upload.single('bukti'), utangController.createUtang);
router.put('/:id', upload.single('bukti'), utangController.updateUtang);
router.delete('/:id', utangController.deleteUtang);

module.exports = router;
