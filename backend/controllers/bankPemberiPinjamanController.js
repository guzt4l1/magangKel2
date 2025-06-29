const BankPemberiPinjaman = require('../models/bankPemberiPinjaman');
const Bank = require('../models/bank');
const PemberiPinjaman = require('../models/pemberiPinjaman');

BankPemberiPinjaman.belongsTo(Bank, { foreignKey: 'bank_id' });
BankPemberiPinjaman.belongsTo(PemberiPinjaman, { foreignKey: 'pemberi_id' });

exports.getAll = async (req, res) => {
  try {
    const data = await BankPemberiPinjaman.findAll({
      include: [
        { model: Bank, attributes: ['nama_bank'] },
        { model: PemberiPinjaman, attributes: ['nama'] }
      ]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await BankPemberiPinjaman.findByPk(id, {
      include: [
        { model: Bank, attributes: ['nama_bank'] },
        { model: PemberiPinjaman, attributes: ['nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { pemberi_id, bank_id, no_rekening } = req.body;
    const created = await BankPemberiPinjaman.create({ pemberi_id, bank_id, no_rekening });
    res.json(created);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambah data', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { pemberi_id, bank_id, no_rekening } = req.body;
    const found = await BankPemberiPinjaman.findByPk(id);
    if (!found) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await found.update({ pemberi_id, bank_id, no_rekening });
    res.json({ message: 'Berhasil diupdate' });
  } catch (err) {
    res.status(400).json({ message: 'Gagal update', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const found = await BankPemberiPinjaman.findByPk(id);
    if (!found) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await found.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ message: 'Gagal menghapus', error: err.message });
  }
};
