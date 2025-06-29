const KategoriJasa = require('../models/kategoriJasa');
const Jasa = require('../models/jasa');
const sequelize = require('../config/db');
// GET semua kategori jasa + jumlah jasa per kategori

exports.getAll = async (req, res) => {
  try {
    const kategori = await KategoriJasa.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM jasa AS j
              WHERE j.kategori_id = KategoriJasa.id
            )`),
            'jumlah_jasa'
          ]
        ]
      },
      order: [['id', 'ASC']]
    });

    res.json(kategori);
  } catch (err) {
    console.error('ERROR getAll kategori-jasa:', err);
    res.status(500).json({
      message: 'Gagal mengambil data kategori jasa',
      error: err.message
    });
  }
};


// POST kategori jasa
exports.create = async (req, res) => {
  try {
    const kategori = await KategoriJasa.create(req.body);
    res.status(201).json(kategori);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan kategori jasa', error: err.message });
  }
};

// PUT kategori jasa
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await KategoriJasa.findByPk(id);
    if (!kategori) return res.status(404).json({ message: 'Kategori jasa tidak ditemukan' });

    await kategori.update(req.body);
    res.json(kategori);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui kategori jasa', error: err.message });
  }
};

// DELETE kategori jasa
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await KategoriJasa.findByPk(id);
    if (!kategori) return res.status(404).json({ message: 'Kategori jasa tidak ditemukan' });

    await kategori.destroy();
    res.json({ message: 'Kategori jasa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus kategori jasa', error: err.message });
  }
};