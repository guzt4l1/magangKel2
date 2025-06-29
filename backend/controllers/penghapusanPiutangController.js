const PenghapusanPiutang = require('../models/penghapusanPiutang');
const Piutang = require('../models/piutang');
const Akun = require('../models/akun');

// Relasi
PenghapusanPiutang.belongsTo(Piutang, { foreignKey: 'piutang_id' });
PenghapusanPiutang.belongsTo(Akun, { as: 'akun_penghapusan', foreignKey: 'akun_penghapusan_id' });

exports.getAll = async (req, res) => {
  try {
    const data = await PenghapusanPiutang.findAll({
      include: [
        { model: Piutang, attributes: ['id', 'no_invoice', 'total', 'sisa_tagihan'] },
        { model: Akun, as: 'akun_penghapusan', attributes: ['id', 'kode', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    console.error('❌ ERROR getAll PenghapusanPiutang:', err);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await PenghapusanPiutang.findByPk(req.params.id, {
      include: [
        { model: Piutang },
        { model: Akun, as: 'akun_penghapusan' }
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
    const created = await PenghapusanPiutang.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await PenghapusanPiutang.findByPk(req.params.id);
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
    const data = await PenghapusanPiutang.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
