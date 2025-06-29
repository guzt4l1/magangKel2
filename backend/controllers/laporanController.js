// controllers/laporanController.js
const { Op, fn, col, literal } = require('sequelize');
const Akun = require('../models/akun');
const SaldoAwal = require('../models/saldoAwal');
const Aset = require('../models/aset');
const Penjualan = require('../models/penjualan');
const PenghasilanLain = require('../models/penghasilanLain');
const PengeluaranBeban = require('../models/pengeluaranBeban');
const { QueryTypes } = require('sequelize');
const db = require('../config/db');

function getRangeTanggal(tahun, bulan) {
  const awal = `${tahun}-${String(bulan).padStart(2, '0')}-01`;
  const akhir = new Date(tahun, bulan, 0).toISOString().split('T')[0];
  return { awal, akhir };
}

exports.getNeraca = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);

  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const akunList = await Akun.findAll({ where: { is_parent: false }, raw: true });
    const saldoAwal = await SaldoAwal.findAll({ where: { tahun }, raw: true });

    const mutasi = await db.query(`
      SELECT akun_id, SUM(IFNULL(debit, 0)) AS debit, SUM(IFNULL(kredit, 0)) AS kredit
      FROM (
        SELECT akun_beban_id AS akun_id, jumlah AS debit, 0 AS kredit FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS debit, jumlah AS kredit FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_modal_id AS akun_id, jumlah AS kredit, 0 AS debit FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS kredit, jumlah AS debit FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_bank_id AS akun_id, jumlah AS debit, 0 AS kredit FROM setoran_bank WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS debit, jumlah AS kredit FROM setoran_bank WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_beban_dimuka_id AS akun_id, jumlah AS debit, 0 AS kredit FROM beban_dibayar_dimuka WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS debit, jumlah AS kredit FROM beban_dibayar_dimuka WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_aset_id AS akun_id, jumlah AS debit, 0 AS kredit FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS debit, jumlah AS kredit FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_penghapusan_id AS akun_id, jumlah AS debit, 0 AS kredit FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT piutang_id AS akun_id, 0 AS debit, jumlah AS kredit FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT utang_id AS akun_id, jumlah_bayar AS debit, 0 AS kredit FROM pengeluaran_kewajiban WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id AS akun_id, 0 AS debit, jumlah_bayar AS kredit FROM pengeluaran_kewajiban WHERE tanggal BETWEEN :awal AND :akhir
      ) AS gabungan
      GROUP BY akun_id
    `, {
      replacements: { awal, akhir },
      type: db.QueryTypes.SELECT
    });

    const saldoMap = {};
    for (const akun of akunList) {
      const id = akun.id;
      const tipe = akun.tipe;

      const awal = saldoAwal.find(s => s.akun_id === id) || { debit: 0, kredit: 0 };
      const mutasiAkun = mutasi.find(m => m.akun_id === id) || { debit: 0, kredit: 0 };

      const saldo = parseFloat(awal.debit || 0) + parseFloat(mutasiAkun.debit || 0)
                  - parseFloat(awal.kredit || 0) - parseFloat(mutasiAkun.kredit || 0);

      if (!saldoMap[tipe]) saldoMap[tipe] = [];
      saldoMap[tipe].push({ nama: akun.nama, kode: akun.kode, saldo });
    }

    const totalAset = saldoMap['aset']?.reduce((acc, a) => acc + a.saldo, 0) || 0;
    const totalKewajiban = saldoMap['kewajiban']?.reduce((acc, a) => acc + a.saldo, 0) || 0;
    const totalEkuitas = saldoMap['ekuitas']?.reduce((acc, a) => acc + a.saldo, 0) || 0;

    res.json({
      aset: saldoMap['aset'] || [],
      kewajiban: saldoMap['kewajiban'] || [],
      ekuitas: saldoMap['ekuitas'] || [],
      total_aset: totalAset,
      total_kewajiban_dan_ekuitas: totalKewajiban + totalEkuitas
    });
  } catch (err) {
    console.error('❌ ERROR getNeraca:', err);
    res.status(500).json({ message: 'Gagal menghasilkan laporan neraca' });
  }
};
exports.getLabaRugi = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);
  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const akunList = await Akun.findAll({ where: { is_parent: false }, raw: true });

    const mutasi = await db.query(`
      SELECT akun_id, SUM(IFNULL(debit, 0)) AS debit, SUM(IFNULL(kredit, 0)) AS kredit
      FROM (
        SELECT akun_beban_id AS akun_id, jumlah AS debit, 0 AS kredit FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_pendapatan_id AS akun_id, 0 AS debit, jumlah AS kredit FROM penghasilan_lain WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_penjualan_id AS akun_id, 0 AS debit, total AS kredit FROM penjualan WHERE tanggal BETWEEN :awal AND :akhir
      ) AS gabungan
      GROUP BY akun_id
    `, {
      replacements: { awal, akhir },
      type: db.QueryTypes.SELECT
    });
    const pendapatan = [];
    const beban = [];
    let totalPendapatan = 0;
    let totalBeban = 0;

    for (const akun of akunList) {
      const m = mutasi.find(x => x.akun_id === akun.id);
      if (!m) continue;

      const saldo = parseFloat(m.kredit || 0) - parseFloat(m.debit || 0);
      if (akun.tipe === 'pendapatan') {
        pendapatan.push({ nama: akun.nama, kode: akun.kode, saldo });
        totalPendapatan += saldo;
      }
      if (akun.tipe === 'beban') {
        const bebanSaldo = parseFloat(m.debit || 0) - parseFloat(m.kredit || 0);
        beban.push({ nama: akun.nama, kode: akun.kode, saldo: bebanSaldo });
        totalBeban += bebanSaldo;
      }
    }

    const labaBersih = totalPendapatan - totalBeban;

    res.json({
      pendapatan,
      beban,
      total_pendapatan: totalPendapatan,
      total_beban: totalBeban,
      laba_bersih: labaBersih
    });
  } catch (err) {
    console.error('❌ ERROR getLabaRugi:', err);
    res.status(500).json({ message: 'Gagal menghasilkan laporan laba rugi' });
  }
};
exports.getRincian = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);

  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const akunList = await Akun.findAll({ where: { is_parent: false }, raw: true });

    const transaksi = await db.query(`
      SELECT akun_id, tanggal, sumber, keterangan, debit, kredit FROM (
        SELECT akun_kas_id AS akun_id, tanggal, 'pengeluaran_beban' AS sumber, keterangan, 0 AS debit, jumlah AS kredit FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_beban_id, tanggal, 'pengeluaran_beban', keterangan, jumlah, 0 FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_penjualan_id, tanggal, 'penjualan', keterangan, 0, total FROM penjualan WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_pendapatan_id, tanggal, 'penghasilan_lain', keterangan, 0, jumlah FROM penghasilan_lain WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_penghapusan_id, tanggal, 'penghapusan_piutang', keterangan, jumlah, 0 FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT piutang_id, tanggal, 'penghapusan_piutang', keterangan, 0, jumlah FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_aset_id, tanggal, 'pembelian_aset', keterangan, jumlah, 0 FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_kas_id, tanggal, 'pembelian_aset', keterangan, 0, jumlah FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir

        UNION ALL
        SELECT akun_kas_id, tanggal, 'penarikan_modal', keterangan, jumlah, 0 FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir
        UNION ALL
        SELECT akun_modal_id, tanggal, 'penarikan_modal', keterangan, 0, jumlah FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir
      ) AS gabungan
      ORDER BY tanggal ASC
    `, {
      replacements: { awal, akhir },
      type: db.QueryTypes.SELECT
    });

    res.json({ akun: akunList, transaksi });
  } catch (err) {
    console.error('❌ ERROR getRincian:', err);
    res.status(500).json({ message: 'Gagal mengambil data rincian transaksi' });
  }
};
exports.getArusKas = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);
  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const hasil = {
      operasi: [], investasi: [], pendanaan: [],
      total_operasi: 0, total_investasi: 0, total_pendanaan: 0
    };

    const data = await db.query(`
      SELECT 'Penjualan' AS keterangan, tanggal, total AS masuk, 0 AS keluar FROM penjualan WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penghasilan Lain', tanggal, jumlah, 0 FROM penghasilan_lain WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Pengeluaran Beban', tanggal, 0, jumlah FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Pengeluaran Kewajiban', tanggal, 0, jumlah_bayar FROM pengeluaran_kewajiban WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penghapusan Piutang', tanggal, 0, jumlah FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir

      UNION ALL
      SELECT 'Pembelian Aset', tanggal, 0, jumlah FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Beban Dibayar Dimuka', tanggal, 0, jumlah FROM beban_dibayar_dimuka WHERE tanggal BETWEEN :awal AND :akhir

      UNION ALL
      SELECT 'Penambahan Modal', tanggal, jumlah, 0 FROM penerimaan_modal WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penarikan Modal', tanggal, 0, jumlah FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Setoran Bank', tanggal, 0, jumlah FROM setoran_bank WHERE tanggal BETWEEN :awal AND :akhir
    `, {
      replacements: { awal, akhir },
      type: db.QueryTypes.SELECT
    });

    for (const row of data) {
      const { keterangan, tanggal, masuk, keluar } = row;
      let tipe = '';
      if (["Penjualan", "Penghasilan Lain", "Pengeluaran Beban", "Pengeluaran Kewajiban", "Penghapusan Piutang"].includes(keterangan)) tipe = 'operasi';
      else if (["Pembelian Aset", "Beban Dibayar Dimuka"].includes(keterangan)) tipe = 'investasi';
      else tipe = 'pendanaan';

      hasil[tipe].push({ tanggal, keterangan, masuk, keluar });
      hasil[`total_${tipe}`] += parseFloat(masuk || 0) - parseFloat(keluar || 0);
    }

    res.json(hasil);
  } catch (err) {
    console.error('❌ ERROR getArusKas:', err);
    res.status(500).json({ message: 'Gagal mengambil data arus kas' });
  }
};
exports.getHistoriTransaksi = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);
  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const data = await db.query(`
      SELECT 'Penjualan' AS jenis, tanggal, akun_penjualan_id AS akun_id, total AS jumlah, keterangan FROM penjualan WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penghasilan Lain', tanggal, akun_pendapatan_id, jumlah, keterangan FROM penghasilan_lain WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Pengeluaran Beban', tanggal, akun_beban_id, jumlah, keterangan FROM pengeluaran_beban WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Pengeluaran Kewajiban', tanggal, utang_id, jumlah_bayar, keterangan FROM pengeluaran_kewajiban WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penghapusan Piutang', tanggal, piutang_id, jumlah, keterangan FROM penghapusan_piutang WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Pembelian Aset', tanggal, akun_aset_id, jumlah, keterangan FROM pembelian_aset WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Beban Dibayar Dimuka', tanggal, akun_beban_dimuka_id, jumlah, keterangan FROM beban_dibayar_dimuka WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Penarikan Modal', tanggal, akun_modal_id, jumlah, keterangan FROM penarikan_modal WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Setoran Bank', tanggal, akun_bank_id, jumlah, keterangan FROM setoran_bank WHERE tanggal BETWEEN :awal AND :akhir
      UNION ALL
      SELECT 'Transfer Rekening', tanggal, akun_bank_sumber_id, jumlah, keterangan FROM transfer_rekening WHERE tanggal BETWEEN :awal AND :akhir
    `, {
      replacements: { awal, akhir },
      type: db.QueryTypes.SELECT
    });

    res.json(data);
  } catch (err) {
    console.error('❌ ERROR getHistoriTransaksi:', err);
    res.status(500).json({ message: 'Gagal mengambil histori transaksi' });
  }
};
exports.getKinerjaKeuangan = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  const bulan = parseInt(req.query.bulan);
  if (!tahun || !bulan) return res.status(400).json({ message: 'Parameter tahun dan bulan wajib diisi' });

  const { awal, akhir } = getRangeTanggal(tahun, bulan);

  try {
    const data = await db.query(`
      SELECT akun.tipe, akun.nama, akun.kode, akun.id, 
        IFNULL(saldo_awal.debit, 0) AS saldo_debit,
        IFNULL(saldo_awal.kredit, 0) AS saldo_kredit,
        SUM(CASE WHEN transaksi.debit IS NOT NULL THEN transaksi.debit ELSE 0 END) AS debit,
        SUM(CASE WHEN transaksi.kredit IS NOT NULL THEN transaksi.kredit ELSE 0 END) AS kredit
      FROM Akuns AS akun
      LEFT JOIN saldo_awal ON akun.id = saldo_awal.akun_id AND saldo_awal.tahun = :tahun
      LEFT JOIN (
        SELECT akun_beban_id AS akun_id, jumlah AS debit, 0 AS kredit, tanggal FROM pengeluaran_beban
        UNION ALL
        SELECT akun_pendapatan_id AS akun_id, 0 AS debit, jumlah AS kredit, tanggal FROM penghasilan_lain
        UNION ALL
        SELECT akun_penjualan_id AS akun_id, 0 AS debit, total AS kredit, tanggal FROM penjualan
      ) AS transaksi ON akun.id = transaksi.akun_id AND transaksi.tanggal BETWEEN :awal AND :akhir
      WHERE akun.is_parent = false
      GROUP BY akun.id
    `, {
      replacements: { tahun, awal, akhir },
      type: db.QueryTypes.SELECT
    });

    // Hitung total penjualan, pendapatan lain, dan beban
    const totalPenjualan = data
      .filter(a => a.nama.toLowerCase().includes('penjualan'))
      .reduce((sum, a) => sum + parseFloat(a.kredit || 0), 0);
    const totalPendapatanLain = data
      .filter(a => a.nama.toLowerCase().includes('pendapatan') || a.nama.toLowerCase().includes('penghasilan'))
      .reduce((sum, a) => sum + parseFloat(a.kredit || 0), 0);
    const totalPendapatan = totalPenjualan + totalPendapatanLain;

    const totalBeban = data
      .filter(a => a.tipe === 'beban')
      .reduce((sum, a) => sum + parseFloat(a.debit || 0), 0);

    const labaBersih = totalPendapatan - totalBeban;

    const rasio = {
      profitMargin: totalPendapatan !== 0 ? (labaBersih / totalPendapatan) * 100 : 0,
      returnOnAssets: 0, // Optional jika ingin tambahkan total aset
      operatingRatio: totalPendapatan !== 0 ? (totalBeban / totalPendapatan) * 100 : 0,
    };

    res.json({
      total_penjualan: totalPenjualan,
      total_pendapatan_lain: totalPendapatanLain,
      total_pendapatan: totalPendapatan,
      total_beban: totalBeban,
      laba_bersih: labaBersih,
      rasio
    });
  } catch (err) {
    console.error('❌ ERROR getKinerjaKeuangan:', err);
    res.status(500).json({ message: 'Gagal mengambil data kinerja keuangan' });
  }
};
exports.getTrendKinerjaKeuangan = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  if (!tahun) return res.status(400).json({ message: 'Parameter tahun wajib diisi' });

  try {
    const hasil = await db.query(`
      SELECT bulan, 
        SUM(CASE WHEN tipe = 'pendapatan' THEN jumlah ELSE 0 END) AS total_pendapatan,
        SUM(CASE WHEN tipe = 'beban' THEN jumlah ELSE 0 END) AS total_beban,
        SUM(CASE WHEN tipe = 'pendapatan' THEN jumlah ELSE 0 END) - 
        SUM(CASE WHEN tipe = 'beban' THEN jumlah ELSE 0 END) AS laba_bersih
      FROM (
        SELECT MONTH(tanggal) AS bulan, jumlah, 'pendapatan' AS tipe
        FROM penghasilan_lain
        WHERE YEAR(tanggal) = :tahun

        UNION ALL

        SELECT MONTH(tanggal) AS bulan, total AS jumlah, 'pendapatan' AS tipe
        FROM penjualan
        WHERE YEAR(tanggal) = :tahun

        UNION ALL

        SELECT MONTH(tanggal) AS bulan, jumlah, 'beban' AS tipe
        FROM pengeluaran_beban
        WHERE YEAR(tanggal) = :tahun
      ) AS gabungan
      GROUP BY bulan
      ORDER BY bulan
    `, {
      replacements: { tahun },
      type: QueryTypes.SELECT
    });

    res.json(hasil);
  } catch (err) {
    console.error('❌ ERROR getTrendKinerjaKeuangan:', err);
    res.status(500).json({ message: 'Gagal mengambil data tren kinerja keuangan' });
  }
};
exports.getAnalisisBebanUsahaTahunan = async (req, res) => {
  const tahun = parseInt(req.query.tahun);
  if (!tahun) return res.status(400).json({ message: 'Parameter tahun wajib diisi' });

  try {
    const hasil = await db.query(`
      SELECT 
        akun.nama AS nama_akun,
        MONTH(pb.tanggal) AS bulan,
        SUM(pb.jumlah) AS total
      FROM pengeluaran_beban pb
      INNER JOIN Akuns akun ON akun.id = pb.akun_beban_id
      WHERE YEAR(pb.tanggal) = :tahun
      GROUP BY pb.akun_beban_id, MONTH(pb.tanggal)
      ORDER BY akun.nama ASC, bulan ASC
    `, {
      replacements: { tahun },
      type: QueryTypes.SELECT
    });

    // Strukturkan data menjadi: { nama_akun: string, data: [12 angka] }
    const struktur = {};
    for (let i = 1; i <= 12; i++) {
      for (const row of hasil) {
        if (!struktur[row.nama_akun]) {
          struktur[row.nama_akun] = Array(12).fill(0);
        }
        if (row.bulan === i) {
          struktur[row.nama_akun][i - 1] += parseFloat(row.total);
        }
      }
    }

    const result = Object.entries(struktur).map(([nama_akun, data]) => ({
      nama_akun,
      data
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ ERROR getAnalisisBebanUsahaTahunan:', err);
    res.status(500).json({ message: 'Gagal mengambil data analisis beban usaha tahunan' });
  }
};
