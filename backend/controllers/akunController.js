const Akun = require('../models/akun');

// Ambil semua akun (dengan relasi parent)
exports.getAll = async (req, res) => {
  try {
    const akun = await Akun.findAll({
      include: [{ model: Akun, as: 'parent', attributes: ['id', 'kode', 'nama'] }],
      order: [['kode', 'ASC']],
    });
    res.json(akun);
  } catch (error) {
    console.error('Gagal mengambil data akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data akun' });
  }
};

// Fungsi lama (alias) — jika masih dipakai di tempat lain
exports.getAllAkun = exports.getAll;

// Ambil akun berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const akun = await Akun.findByPk(req.params.id, {
      include: [{ model: Akun, as: 'parent', attributes: ['id', 'kode', 'nama'] }]
    });
    if (!akun) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    res.json(akun);
  } catch (error) {
    console.error('Gagal mengambil akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data akun' });
  }
};

// Tambah akun
exports.create = async (req, res) => {
  try {
    const { kode, nama, tipe, is_parent, parent_id } = req.body;
    const akunBaru = await Akun.create({
      kode,
      nama,
      tipe,
      is_parent,
      parent_id: parent_id || null
    });
    res.status(201).json(akunBaru);
  } catch (error) {
    console.error('Gagal menambahkan akun:', error);
    res.status(400).json({ message: 'Gagal menambahkan akun', error: error.message });
  }
};

// Update akun
exports.update = async (req, res) => {
  try {
    const akun = await Akun.findByPk(req.params.id);
    if (!akun) return res.status(404).json({ message: 'Akun tidak ditemukan' });

    const { kode, nama, tipe, is_parent, parent_id } = req.body;
    await akun.update({
      kode,
      nama,
      tipe,
      is_parent,
      parent_id: parent_id || null
    });
    res.json({ message: 'Akun berhasil diperbarui' });
  } catch (error) {
    console.error('Gagal update akun:', error);
    res.status(400).json({ message: 'Gagal memperbarui akun', error: error.message });
  }
};

// Hapus akun
exports.remove = async (req, res) => {
  try {
    const akun = await Akun.findByPk(req.params.id);
    if (!akun) return res.status(404).json({ message: 'Akun tidak ditemukan' });

    await akun.destroy();
    res.json({ message: 'Akun berhasil dihapus' });
  } catch (error) {
    console.error('Gagal menghapus akun:', error);
    res.status(400).json({ message: 'Gagal menghapus akun', error: error.message });
  }
};
