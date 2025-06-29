// controllers/bankController.js

const Bank = require('../models/bank');

// Ambil semua data bank
exports.getAll = async (req, res) => {
  try {
    const banks = await Bank.findAll({ order: [['id', 'ASC']] });
    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data bank', error });
  }
};

// Tambah data bank
exports.create = async (req, res) => {
  try {
    const { nama_bank, no_rekening, atas_nama } = req.body;
    const newBank = await Bank.create({ nama_bank, no_rekening, atas_nama });
    res.status(201).json(newBank);
  } catch (error) {
    res.status(400).json({ message: 'Gagal menambahkan bank', error });
  }
};

// Update data bank
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_bank, no_rekening, atas_nama } = req.body;

    const bank = await Bank.findByPk(id);
    if (!bank) return res.status(404).json({ message: 'Bank tidak ditemukan' });

    await bank.update({ nama_bank, no_rekening, atas_nama });
    res.json(bank);
  } catch (error) {
    res.status(400).json({ message: 'Gagal mengubah data bank', error });
  }
};

// Hapus data bank
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const bank = await Bank.findByPk(id);
    if (!bank) return res.status(404).json({ message: 'Bank tidak ditemukan' });

    await bank.destroy();
    res.json({ message: 'Data bank berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus bank', error });
  }
};
