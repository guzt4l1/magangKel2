const PendapatanDimuka = require('../models/pendapatanDimuka');
const Akun = require('../models/akun');
const Pelanggan = require('../models/pelanggan');

// Relasi
PendapatanDimuka.belongsTo(Pelanggan, { foreignKey: 'pelanggan_id' });
PendapatanDimuka.belongsTo(Akun, { as: 'akun_kas', foreignKey: 'akun_kas_id' });
PendapatanDimuka.belongsTo(Akun, { as: 'akun_pendapatan_dimuka', foreignKey: 'akun_pendapatan_dimuka_id' });

exports.getAllPendapatanDimuka = async (req, res) => {
  try {
    const data = await PendapatanDimuka.findAll({
      include: [
        { model: Pelanggan, attributes: ['id', 'nama'] },
        { model: Akun, as: 'akun_kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akun_pendapatan_dimuka', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendapatanDimukaById = async (req, res) => {
  try {
    const data = await PendapatanDimuka.findByPk(req.params.id, {
      include: [
        { model: Pelanggan, attributes: ['id', 'nama'] },
        { model: Akun, as: 'akun_kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akun_pendapatan_dimuka', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPendapatanDimuka = async (req, res) => {
  try {
    const newData = await PendapatanDimuka.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePendapatanDimuka = async (req, res) => {
  try {
    const data = await PendapatanDimuka.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.update(req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePendapatanDimuka = async (req, res) => {
  try {
    const data = await PendapatanDimuka.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
