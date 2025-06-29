const PembelianAset = require('../models/pembelianAset');
const Aset = require('../models/aset');
const Pemasok = require('../models/pemasok');
const Akun = require('../models/akun');

// Relasi
PembelianAset.belongsTo(Aset, { foreignKey: 'aset_id' });
PembelianAset.belongsTo(Pemasok, { foreignKey: 'pemasok_id' });
PembelianAset.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });

exports.getAllPembelianAset = async (req, res) => {
  try {
    const data = await PembelianAset.findAll({
      include: [
        { model: Aset, attributes: ['id', 'nama'] },
        { model: Pemasok, attributes: ['id', 'nama'] },
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('❌ ERROR getAllPembelianAset:', error);
    res.status(500).json({ message: 'Gagal mengambil data pembelian aset' });
  }
};

exports.getPembelianAsetById = async (req, res) => {
  try {
    const data = await PembelianAset.findByPk(req.params.id, {
      include: [
        { model: Aset, attributes: ['id', 'nama'] },
        { model: Pemasok, attributes: ['id', 'nama'] },
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPembelianAset = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await PembelianAset.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePembelianAset = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PembelianAset.findByPk(id);
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

exports.deletePembelianAset = async (req, res) => {
  try {
    const data = await PembelianAset.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
