const BebanLain = require('../models/bebanLain');
const Akun = require('../models/akun');

// Relasi manual
BebanLain.belongsTo(Akun, { foreignKey: 'akun_beban_id' });

exports.getAll = async (req, res) => {
  try {
    const data = await BebanLain.findAll({
      include: { model: Akun, attributes: ['kode', 'nama'] }
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await BebanLain.findByPk(id, {
      include: { model: Akun, attributes: ['kode', 'nama'] }
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama, akun_beban_id } = req.body;
    const created = await BebanLain.create({ nama, akun_beban_id });
    res.json(created);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambah data', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama, akun_beban_id } = req.body;
    const found = await BebanLain.findByPk(id);
    if (!found) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await found.update({ nama, akun_beban_id });
    res.json({ message: 'Berhasil diupdate' });
  } catch (err) {
    res.status(400).json({ message: 'Gagal update', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const found = await BebanLain.findByPk(id);
    if (!found) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await found.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ message: 'Gagal menghapus', error: err.message });
  }
};
