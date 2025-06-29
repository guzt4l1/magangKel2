const BebanDibayarDimuka = require('../models/bebanDibayarDimuka');
const Akun = require('../models/akun');

// Relasi
BebanDibayarDimuka.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });
BebanDibayarDimuka.belongsTo(Akun, { as: 'bebanDimuka', foreignKey: 'akun_beban_dimuka_id' });

exports.getAll = async (req, res) => {
  try {
    const data = await BebanDibayarDimuka.findAll({
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'bebanDimuka', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    console.error('❌ ERROR getAll BebanDibayarDimuka:', err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await BebanDibayarDimuka.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'bebanDimuka', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await BebanDibayarDimuka.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await BebanDibayarDimuka.findByPk(req.params.id);
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

exports.remove = async (req, res) => {
  try {
    const data = await BebanDibayarDimuka.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
