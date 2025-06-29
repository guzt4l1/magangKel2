// controllers/pelangganController.js

const Pelanggan = require('../models/pelanggan');

// GET semua pelanggan
exports.getAll = async (req, res) => {
  try {
    const data = await Pelanggan.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pelanggan', error: err.message });
  }
};

// POST tambah pelanggan
exports.create = async (req, res) => {
  try {
    const pelanggan = await Pelanggan.create(req.body);
    res.status(201).json(pelanggan);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan pelanggan', error: err.message });
  }
};

// PUT update pelanggan
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const pelanggan = await Pelanggan.findByPk(id);
    if (!pelanggan) return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });

    await pelanggan.update(req.body);
    res.json(pelanggan);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui pelanggan', error: err.message });
  }
};

// DELETE pelanggan
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pelanggan = await Pelanggan.findByPk(id);
    if (!pelanggan) return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });

    await pelanggan.destroy();
    res.json({ message: 'Pelanggan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus pelanggan', error: err.message });
  }
};
