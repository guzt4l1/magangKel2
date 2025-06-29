const PenarikanModal = require('../models/penarikanModal');
const Akun = require('../models/akun');

// Relasi
PenarikanModal.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });
PenarikanModal.belongsTo(Akun, { as: 'modal', foreignKey: 'akun_modal_id' });

exports.getAllPenarikanModal = async (req, res) => {
  try {
    const data = await PenarikanModal.findAll({
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'modal', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data penarikan modal' });
  }
};

exports.getPenarikanModalById = async (req, res) => {
  try {
    const data = await PenarikanModal.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'kas', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'modal', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPenarikanModal = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await PenarikanModal.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePenarikanModal = async (req, res) => {
  try {
    const data = await PenarikanModal.findByPk(req.params.id);
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

exports.deletePenarikanModal = async (req, res) => {
  try {
    const data = await PenarikanModal.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
