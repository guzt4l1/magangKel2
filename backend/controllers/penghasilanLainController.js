const PenghasilanLain = require('../models/penghasilanLain');
const Akun = require('../models/akun');

// Relasi manual
PenghasilanLain.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });
PenghasilanLain.belongsTo(Akun, { as: 'pendapatan', foreignKey: 'akun_pendapatan_id' });

exports.getAllPenghasilanLain = async (req, res) => {
  try {
    const data = await PenghasilanLain.findAll({
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'pendapatan', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPenghasilanLainById = async (req, res) => {
  try {
    const data = await PenghasilanLain.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'pendapatan', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPenghasilanLain = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };

    const data = await PenghasilanLain.create(payload);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePenghasilanLain = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PenghasilanLain.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.update({
      ...req.body,
      updated_by: req.user?.id || 1
    });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePenghasilanLain = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PenghasilanLain.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
