// routes/piutang.js
const express = require('express');
const router = express.Router();

const Piutang = require('../models/piutang');
const Pelanggan = require('../models/pelanggan');
const Akun = require('../models/akun');

// Relasi
Piutang.belongsTo(Pelanggan, { foreignKey: 'pelanggan_id' });
Piutang.belongsTo(Akun, { as: 'akun_piutang', foreignKey: 'akun_piutang_id' });

router.get('/', async (req, res) => {
  try {
    const data = await Piutang.findAll({
      include: [
        { model: Pelanggan, attributes: ['id', 'nama'] },
        { model: Akun, as: 'akun_piutang', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal_transaksi', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    console.error('❌ ERROR GET /piutang:', err);
    res.status(500).json({ message: 'Gagal mengambil data piutang' });
  }
});

module.exports = router;
