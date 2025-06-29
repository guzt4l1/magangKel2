// controllers/asetController.js
const Aset = require('../models/aset');

exports.getAllAset = async (req, res) => {
  try {
    const aset = await Aset.findAll();
    res.json(aset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aset', error });
  }
};

exports.getAsetById = async (req, res) => {
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    res.json(aset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data aset', error });
  }
};

exports.createAset = async (req, res) => {
  try {
    const aset = await Aset.create(req.body);
    res.status(201).json(aset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambah aset', error });
  }
};

exports.updateAset = async (req, res) => {
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    await aset.update(req.body);
    res.json(aset);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui aset', error });
  }
};

exports.deleteAset = async (req, res) => {
  try {
    const aset = await Aset.findByPk(req.params.id);
    if (!aset) return res.status(404).json({ message: 'Aset tidak ditemukan' });
    await aset.destroy();
    res.json({ message: 'Aset berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus aset', error });
  }
};
