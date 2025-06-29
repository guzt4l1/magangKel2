import { Op, fn, col } from 'sequelize';
import db from '../config/db.js';
import Penjualan from '../models/penjualan.js';
import Jasa from '../models/jasa.js';
import Utang from '../models/utang.js';
import Piutang from '../models/piutang.js';
import PengeluaranBeban from '../models/pengeluaranBeban.js';
import Pelanggan from '../models/pelanggan.js'; 

// 📊 Total Penjualan Per Bulan
export async function getTotalPenjualanPerBulan(tahun) {
  const awal = `${tahun}-01-01`;
  const akhir = `${tahun}-12-31`;

  const rows = await db.query(`
    SELECT 
      MONTH(tanggal) AS bulan,
      SUM(total) AS total
    FROM penjualan
    WHERE tanggal BETWEEN :awal AND :akhir
    GROUP BY MONTH(tanggal)
  `, {
    replacements: { awal, akhir },
    type: db.QueryTypes.SELECT,
  });

  const data = Array(12).fill(0);
  rows.forEach((item) => {
    const index = parseInt(item.bulan, 10) - 1;
    data[index] = Number(item.total);
  });

  return data;
}

// 💼 Jasa Aktif
export async function getJasa() {
  return await Jasa.findAll({
    attributes: ['id', 'nama', 'harga', 'created_at']
  });
}

// utang
export async function getDaftarUtang() {
  const daftar = await Utang.findAll({
    attributes: ['id', 'keterangan', ['total', 'jumlah'], 'jatuh_tempo'],
    order: [['jatuh_tempo', 'ASC']]
  });
  return daftar;
}


// 💰 Total Sisa Piutang
export async function getDaftarPiutang() {
  const rows = await db.query(`
    SELECT 
      p.id,
      pl.nama AS nama_pelanggan,
      p.total AS jumlah,
      p.tanggal_transaksi
    FROM piutang p
    LEFT JOIN pelanggan pl ON p.pelanggan_id = pl.id
    ORDER BY p.tanggal_transaksi ASC
  `, {
    type: db.QueryTypes.SELECT
  });

  return rows;
}



// 📈 Beban Usaha Per Kategori per Tahun
export async function getBebanUsahaPerKategori(tahun) {
  const awal = `${tahun}-01-01`;
  const akhir = `${tahun}-12-31`;

  const rows = await db.query(`
    SELECT 
      b.nama AS kategori, 
      SUM(p.jumlah) AS total
    FROM pengeluaran_beban p
    JOIN beban_lain b ON p.beban_id = b.id
    WHERE p.tanggal BETWEEN :awal AND :akhir
    GROUP BY p.beban_id
  `, {
    replacements: { awal, akhir },
    type: db.QueryTypes.SELECT,
  });

  return rows;
}
