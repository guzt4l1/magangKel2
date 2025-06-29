const SetoranBank = require('../models/setoranBank');
const Akun = require('../models/akun');

// Relasi
SetoranBank.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });
SetoranBank.belongsTo(Akun, { as: 'bank', foreignKey: 'akun_bank_id' });

exports.getAllSetoranBank = async (req, res) => {
  try {
    const data = await SetoranBank.findAll({
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'bank', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSetoranBankById = async (req, res) => {
  try {
    const data = await SetoranBank.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSetoranBank = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await SetoranBank.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSetoranBank = async (req, res) => {
  try {
    const data = await SetoranBank.findByPk(req.params.id);
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

exports.deleteSetoranBank = async (req, res) => {
  try {
    const data = await SetoranBank.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
