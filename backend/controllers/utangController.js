const fs = require('fs');
const path = require('path');
const Utang = require('../models/utang');
const Akun = require('../models/akun');
const Pemasok = require('../models/pemasok');

// Relasi
Utang.belongsTo(Akun, { foreignKey: 'akun_utang_id', as: 'akunUtang' });
Utang.belongsTo(Akun, { foreignKey: 'akun_pembelian_id', as: 'akunPembelian' });
Utang.belongsTo(Pemasok, { foreignKey: 'pemasok_id', as: 'pemasok' });

exports.getAllUtang = async (req, res) => {
  try {
    const data = await Utang.findAll({
      include: [
        { model: Akun, as: 'akunUtang', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunPembelian', attributes: ['id', 'kode', 'nama'] },
        { model: Pemasok, as: 'pemasok', attributes: ['id', 'nama'] }
      ],
      order: [['jatuh_tempo', 'ASC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUtangById = async (req, res) => {
  try {
    const data = await Utang.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'akunUtang', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunPembelian', attributes: ['id', 'kode', 'nama'] },
        { model: Pemasok, as: 'pemasok', attributes: ['id', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUtang = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      bukti: req.file ? `/uploads/transaksi/${req.file.filename}` : null,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const data = await Utang.create(payload);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUtang = async (req, res) => {
  try {
    const data = await Utang.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    // Hapus file lama jika ada dan user upload file baru
    if (req.file && data.bukti) {
      const oldPath = path.join(__dirname, '..', 'public', data.bukti);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedData = {
      ...req.body,
      updated_by: req.user?.id || 1
    };

    if (req.file) {
      updatedData.bukti = `/uploads/transaksi/${req.file.filename}`;
    }

    await data.update(updatedData);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUtang = async (req, res) => {
  try {
    const data = await Utang.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    if (data.bukti) {
      const filePath = path.join(__dirname, '..', 'public', data.bukti);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
