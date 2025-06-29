const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.get('/neraca', laporanController.getNeraca);
router.get('/laba-rugi', laporanController.getLabaRugi);
router.get('/rincian', laporanController.getRincian);
router.get('/arus-kas', laporanController.getArusKas);
router.get('/histori', laporanController.getHistoriTransaksi);
router.get('/kinerja-keuangan', laporanController.getKinerjaKeuangan);
router.get('/trend', laporanController.getTrendKinerjaKeuangan);
router.get('/analisis-beban', laporanController.getAnalisisBebanUsahaTahunan);

module.exports = router;
