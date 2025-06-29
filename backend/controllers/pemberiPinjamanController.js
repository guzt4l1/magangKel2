const PemberiPinjaman = require('../models/pemberiPinjaman');

exports.getAll = async (req, res) => {
  try {
    const data = await PemberiPinjaman.findAll({ order: [['created_at', 'DESC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, jenis, kontak } = req.body;
    const baru = await PemberiPinjaman.create({ nama, jenis, kontak });
    res.status(201).json(baru);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan data', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama, jenis, kontak } = req.body;
    const { id } = req.params;
    const data = await PemberiPinjaman.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.update({ nama, jenis, kontak });
    res.json({ message: 'Data berhasil diperbarui' });
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui data', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await PemberiPinjaman.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus data', error: err.message });
  }
};
