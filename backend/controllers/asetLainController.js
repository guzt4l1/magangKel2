// controllers/asetLainController.js
const AsetLain = require('../models/asetLain');

// GET semua aset lain
exports.getAllAsetLain = async (req, res) => {
  try {
    const data = await AsetLain.findAll({ order: [['id', 'DESC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data aset lain', error: err.message });
  }
};

// POST aset lain baru
exports.createAsetLain = async (req, res) => {
  try {
    const aset = await AsetLain.create(req.body);
    res.status(201).json(aset);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan aset lain', error: err.message });
  }
};

// PUT (update) aset lain
exports.updateAsetLain = async (req, res) => {
  try {
    const id = req.params.id;
    const aset = await AsetLain.findByPk(id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    await aset.update(req.body);
    res.json(aset);
  } catch (err) {
    res.status(400).json({ message: 'Gagal mengupdate aset lain', error: err.message });
  }
};

// DELETE aset lain
exports.deleteAsetLain = async (req, res) => {
  try {
    const id = req.params.id;
    const aset = await AsetLain.findByPk(id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });

    await aset.destroy();
    res.json({ message: 'Aset berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus aset lain', error: err.message });
  }
};
