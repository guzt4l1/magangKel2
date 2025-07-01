const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const Penjualan = require('../models/penjualan');
const Akun = require('../models/akun');
const Pelanggan = require('../models/pelanggan');
const Piutang = require('../models/piutang');

// Relasi hanya di-declare sekali per model
function setupAssociations() {
  // Untuk Penjualan Jasa dan Aset
  if (!Penjualan.associations.pelanggan) {
    Penjualan.belongsTo(Pelanggan, { foreignKey: 'pelanggan_id' });
  }
  if (!Penjualan.associations.piutang) {
    Penjualan.belongsTo(Akun, { as: 'piutang', foreignKey: 'akun_piutang_id' });
  }
  if (!Penjualan.associations.penjualan) {
    Penjualan.belongsTo(Akun, { as: 'penjualan', foreignKey: 'akun_penjualan_id' });
  }
  if (!Penjualan.associations.jasa) {
    const Jasa = require('../models/jasa');
    Penjualan.belongsTo(Jasa, { foreignKey: 'jasa_id' });
  }
  if (!Penjualan.associations.aset) {
    Penjualan.belongsTo(Akun, { as: 'aset', foreignKey: 'akun_aset_id' });
  }

  // Untuk Pembayaran Piutang
  if (!Piutang.associations.pelanggan) {
    Piutang.belongsTo(Pelanggan, { foreignKey: 'pelanggan_id' });
  }
  if (!Piutang.associations.piutang) {
    Piutang.belongsTo(Akun, { as: 'piutang', foreignKey: 'akun_piutang_id' });
  }
  if (!Piutang.associations.penjualan) {
    Piutang.belongsTo(Akun, { as: 'penjualan', foreignKey: 'akun_penjualan_id' });
  }
}

exports.getAllPenjualan = async (req, res) => {
  try {
    setupAssociations();
    const { jenis_transaksi } = req.query;

    if (jenis_transaksi === 'pembayaran_piutang') {
      const dataPiutang = await Piutang.findAll({
        include: [
          { model: Pelanggan, attributes: ['id', 'nama'] },
          { model: Akun, as: 'piutang', attributes: ['id', 'kode', 'nama'] },
          { model: Akun, as: 'penjualan', attributes: ['id', 'kode', 'nama'] }
        ],
        order: [['tanggal_transaksi', 'DESC'], ['id', 'DESC']]
      });
      return res.json(dataPiutang);
    }

    const includeBase = [
      { model: Pelanggan, attributes: ['id', 'nama'] },
      { model: Akun, as: 'piutang', attributes: ['id', 'kode', 'nama'] },
      { model: Akun, as: 'penjualan', attributes: ['id', 'kode', 'nama'] },
    ];

    if (jenis_transaksi === 'penjualan_jasa') {
      const Jasa = require('../models/jasa');
      includeBase.push({ model: Jasa, attributes: ['id', 'nama', 'harga'] });
    }

    if (jenis_transaksi === 'penjualan_aset') {
      includeBase.push({ model: Akun, as: 'aset', attributes: ['id', 'kode', 'nama'] });
    }

    const dataPenjualan = await Penjualan.findAll({
      include: includeBase,
      order: [['tanggal', 'DESC'], ['id', 'DESC']]
    });

    return res.json(dataPenjualan);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getPenjualanById = async (req, res) => {
  try {
    setupAssociations();
    const data = await Penjualan.findByPk(req.params.id, {
      include: [
        { model: Pelanggan, attributes: ['id', 'nama'] },
        { model: Akun, as: 'piutang', attributes: ['id', 'kode', 'nama'] },
        { model: Akun, as: 'penjualan', attributes: ['id', 'kode', 'nama'] }
      ]
    });
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPenjualan = async (req, res) => {
  const t = await db.transaction();
  try {
    const {
      jenis_transaksi,
      metode_pembayaran,
      tanggal,
      pelanggan_id,
      akun_penjualan_id,
      akun_piutang_id,
      total,
      uang_muka,
      jatuh_tempo,
      keterangan
    } = req.body;

    const bukti = req.file ? `/uploads/penjualan/${req.file.filename}` : null;

    if (jenis_transaksi !== 'penjualan_jasa') {
      return res.status(400).json({ message: 'Jenis transaksi tidak didukung.' });
    }

    const penjualan = await Penjualan.create({
      tanggal,
      pelanggan_id,
      akun_penjualan_id,
      akun_piutang_id,
      total,
      metode_pembayaran,
      keterangan,
      bukti,
      created_by: req.user?.id || 1,
      updated_by: req.user?.id || 1
    }, { transaction: t });

    if (metode_pembayaran === 'kredit') {
      const sisa_tagihan = parseFloat(total) - parseFloat(uang_muka || 0);
      if (!jatuh_tempo) throw new Error('Jatuh tempo wajib diisi untuk kredit.');

      await Piutang.create({
        pelanggan_id,
        tanggal_transaksi: tanggal,
        jatuh_tempo,
        no_invoice: `INV-${penjualan.id}`,
        total,
        sisa_tagihan,
        akun_piutang_id,
        akun_penjualan_id,
        keterangan: `Piutang dari penjualan jasa`,
        bukti,
        created_by: req.user?.id || 1,
        updated_by: req.user?.id || 1
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(penjualan);

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(400).json({ message: error.message || 'Gagal menyimpan data penjualan.' });
  }
};

exports.updatePenjualan = async (req, res) => {
  const t = await db.transaction();
  try {
    const id = req.params.id;
    const data = await Penjualan.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    if (req.file && data.bukti) {
      const oldPath = path.join(__dirname, '..', 'public', data.bukti);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedData = {
      ...req.body,
      bukti: req.file ? `/uploads/penjualan/${req.file.filename}` : data.bukti,
      updated_by: req.user?.id || 1
    };

    await data.update(updatedData, { transaction: t });

    if (updatedData.metode_pembayaran === 'kredit') {
      const sisa_tagihan = parseFloat(updatedData.total) - parseFloat(updatedData.uang_muka || 0);
      await Piutang.upsert({
        pelanggan_id: updatedData.pelanggan_id,
        tanggal_transaksi: updatedData.tanggal,
        jatuh_tempo: updatedData.jatuh_tempo,
        no_invoice: `INV-${data.id}`,
        total: updatedData.total,
        sisa_tagihan,
        akun_piutang_id: updatedData.akun_piutang_id,
        akun_penjualan_id: updatedData.akun_penjualan_id,
        keterangan: `Piutang dari penjualan jasa`,
        bukti: updatedData.bukti,
        created_by: req.user?.id || 1,
        updated_by: req.user?.id || 1
      }, { transaction: t });
    }

    await t.commit();
    res.json(data);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

exports.deletePenjualan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Penjualan.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });

    if (data.bukti) {
      const filePath = path.join(__dirname, '..', 'public', data.bukti);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Piutang.destroy({ where: { no_invoice: `INV-${id}` } });
    await data.destroy();
    res.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
