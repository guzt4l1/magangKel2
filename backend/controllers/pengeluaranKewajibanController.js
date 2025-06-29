const PengeluaranKewajiban = require('../models/pengeluaranKewajiban');
const Akun = require('../models/akun');
const PenerimaanUtang = require('../models/utang');

// Relasi
PengeluaranKewajiban.belongsTo(Akun, { as: 'kas', foreignKey: 'akun_kas_id' });
PengeluaranKewajiban.belongsTo(PenerimaanUtang, { foreignKey: 'utang_id' });

exports.getAllPengeluaranKewajiban = async (req, res) => {
  try {
    const data = await PengeluaranKewajiban.findAll({
      include: [
        {
          model: PenerimaanUtang,
          attributes: ['id', 'no_faktur', 'total', 'sisa_utang']
        },
        {
          model: Akun,
          as: 'kas',
          attributes: ['id', 'kode', 'nama']
        }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    console.error('❌ ERROR getAllPengeluaranKewajiban:', error); // Penting!
    res.status(500).json({ message: 'Gagal mengambil data pengeluaran kewajiban' });
  }
};

exports.getPengeluaranKewajibanById = async (req, res) => {
  try {
    const data = await PengeluaranKewajiban.findByPk(req.params.id, {
      include: [
        { model: Akun, attributes: ['id', 'kode', 'nama'] },
        { model: PenerimaanUtang, as: 'utang', attributes: ['id', 'nama_pemberi', 'jumlah'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPengeluaranKewajiban = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    };
    const newData = await PengeluaranKewajiban.create(payload);
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePengeluaranKewajiban = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PengeluaranKewajiban.findByPk(id);
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

exports.deletePengeluaranKewajiban = async (req, res) => {
  try {
    const data = await PengeluaranKewajiban.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
