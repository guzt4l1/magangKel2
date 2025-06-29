// backend/controllers/saldoAwalController.js
const SaldoAwal = require('../models/saldoAwal');
const Akun = require('../models/akun');

// Ambil semua data saldo awal beserta data akun terkait
exports.getAll = async (req, res) => {
  try {
    const data = await SaldoAwal.findAll({
      include: [
        {
          model: Akun,
          attributes: ['kode', 'nama', 'tipe'],
        },
      ],
      order: [['tahun', 'DESC'], ['akun_id', 'ASC']],
    });
    res.json(data);
  } catch (err) {
    console.error('Error ambil saldo awal:', err);
    res.status(500).json({ message: 'Gagal ambil data saldo awal' });
  }
};

// Tambah saldo awal
exports.create = async (req, res) => {
  try {
    const { akun_id, tahun, debit, kredit, keterangan } = req.body;
    const existing = await SaldoAwal.findOne({ where: { akun_id, tahun } });

    if (existing) {
      return res.status(400).json({ message: 'Saldo awal untuk akun dan tahun ini sudah ada' });
    }

    const data = await SaldoAwal.create({ akun_id, tahun, debit, kredit, keterangan });
    res.status(201).json(data);
  } catch (err) {
    console.error('Error tambah saldo awal:', err);
    res.status(500).json({ message: 'Gagal tambah data' });
  }
};

// Update saldo awal
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { debit, kredit, keterangan } = req.body;

    await SaldoAwal.update(
      { debit, kredit, keterangan },
      { where: { id } }
    );

    res.json({ message: 'Berhasil update saldo awal' });
  } catch (err) {
    console.error('Error update saldo awal:', err);
    res.status(500).json({ message: 'Gagal update data' });
  }
};

// Hapus saldo awal
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await SaldoAwal.destroy({ where: { id } });
    res.json({ message: 'Berhasil hapus saldo awal' });
  } catch (err) {
    console.error('Error hapus saldo awal:', err);
    res.status(500).json({ message: 'Gagal hapus data' });
  }
};
