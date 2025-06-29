const PenerimaanModal = require('../models/penerimaanModal');
const Akun = require('../models/akun');

// Relasi
PenerimaanModal.belongsTo(Akun, { foreignKey: 'akun_modal_id', as: 'akunModal' });
PenerimaanModal.belongsTo(Akun, { foreignKey: 'akun_kas_id', as: 'akunKas' });

exports.getAllPenerimaanModal = async (req, res) => {
  try {
    const data = await PenerimaanModal.findAll({
      include: [
        { model: Akun, as: 'akunModal', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunKas', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPenerimaanModalById = async (req, res) => {
  try {
    const data = await PenerimaanModal.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'akunModal', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'akunKas', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPenerimaanModal = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const data = await PenerimaanModal.create(payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePenerimaanModal = async (req, res) => {
  try {
    const data = await PenerimaanModal.findByPk(req.params.id);
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

exports.deletePenerimaanModal = async (req, res) => {
  try {
    const data = await PenerimaanModal.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
