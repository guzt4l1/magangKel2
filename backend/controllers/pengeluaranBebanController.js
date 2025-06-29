const PengeluaranBeban = require('../models/pengeluaranBeban');
const BebanLain = require('../models/bebanLain');
const Akun = require('../models/akun');

// Relasi
PengeluaranBeban.belongsTo(BebanLain, { foreignKey: 'beban_id' });
PengeluaranBeban.belongsTo(Akun, { as: 'akunBeban', foreignKey: 'akun_beban_id' });
PengeluaranBeban.belongsTo(Akun, { as: 'akunKas', foreignKey: 'akun_kas_id' });

exports.getAllPengeluaranBeban = async (req, res) => {
  try {
    const data = await PengeluaranBeban.findAll({
      include: [
        { model: BebanLain, attributes: ['id', 'nama'] },
        { model: Akun, as: 'akunBeban', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunKas', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    console.error('❌ ERROR getAllPengeluaranBeban:', err);
    res.status(500).json({ message: 'Gagal mengambil data pengeluaran beban' });
  }
};

exports.getPengeluaranBebanById = async (req, res) => {
  try {
    const data = await PengeluaranBeban.findByPk(req.params.id, {
      include: [
        { model: BebanLain, attributes: ['id', 'nama'] },
        { model: Akun, as: 'akunBeban', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunKas', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPengeluaranBeban = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const data = await PengeluaranBeban.create(payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePengeluaranBeban = async (req, res) => {
  try {
    const data = await PengeluaranBeban.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.update({
      ...req.body,
      updated_by: req.user?.id || 1
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePengeluaranBeban = async (req, res) => {
  try {
    const data = await PengeluaranBeban.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
