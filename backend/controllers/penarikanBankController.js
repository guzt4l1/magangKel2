const PenarikanBank = require('../models/penarikanBank');
const Akun = require('../models/akun');

// Relasi
PenarikanBank.belongsTo(Akun, { foreignKey: 'akun_bank_id', as: 'bank' });
PenarikanBank.belongsTo(Akun, { foreignKey: 'akun_kas_id', as: 'kas' });

// GET all
exports.getAllPenarikanBank = async (req, res) => {
  try {
    const data = await PenarikanBank.findAll({
      include: [
        { model: Akun, as: 'bank', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by ID
exports.getPenarikanBankById = async (req, res) => {
  try {
    const data = await PenarikanBank.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'bank', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST
exports.createPenarikanBank = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await PenarikanBank.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT
exports.updatePenarikanBank = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PenarikanBank.findByPk(id);
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

// DELETE
exports.deletePenarikanBank = async (req, res) => {
  try {
    const data = await PenarikanBank.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
