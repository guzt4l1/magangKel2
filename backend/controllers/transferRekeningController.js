const TransferRekening = require('../models/transferRekening');
const Akun = require('../models/akun');

// Relasi
TransferRekening.belongsTo(Akun, { as: 'sumber', foreignKey: 'akun_bank_sumber_id' });
TransferRekening.belongsTo(Akun, { as: 'tujuan', foreignKey: 'akun_bank_tujuan_id' });

exports.getAllTransferRekening = async (req, res) => {
  try {
    const data = await TransferRekening.findAll({
      include: [
        { model: Akun, as: 'sumber', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'tujuan', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data transfer rekening' });
  }
};

exports.getTransferRekeningById = async (req, res) => {
  try {
    const data = await TransferRekening.findByPk(req.params.id, {
      include: [
        { model: Akun, as: 'sumber', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'tujuan', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTransferRekening = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const data = await TransferRekening.create(payload);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTransferRekening = async (req, res) => {
  try {
    const data = await TransferRekening.findByPk(req.params.id);
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

exports.deleteTransferRekening = async (req, res) => {
  try {
    const data = await TransferRekening.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
