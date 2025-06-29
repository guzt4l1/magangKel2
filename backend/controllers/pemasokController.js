// controllers/pemasokController.js

const Pemasok = require('../models/pemasok');

// GET semua pemasok
exports.getAll = async (req, res) => {
  try {
    const data = await Pemasok.findAll({ order: [['id', 'ASC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pemasok', error: err.message });
  }
};

// POST tambah pemasok
exports.create = async (req, res) => {
  try {
    const pemasok = await Pemasok.create(req.body);
    res.status(201).json(pemasok);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan pemasok', error: err.message });
  }
};

// PUT update pemasok
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const pemasok = await Pemasok.findByPk(id);
    if (!pemasok) return res.status(404).json({ message: 'Pemasok tidak ditemukan' });

    await pemasok.update(req.body);
    res.json(pemasok);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui pemasok', error: err.message });
  }
};

// DELETE pemasok
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const pemasok = await Pemasok.findByPk(id);
    if (!pemasok) return res.status(404).json({ message: 'Pemasok tidak ditemukan' });

    await pemasok.destroy();
    res.json({ message: 'Pemasok berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus pemasok', error: err.message });
  }
};
