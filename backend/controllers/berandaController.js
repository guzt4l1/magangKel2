const Penjualan = require('../models/Penjualan');
const Jasa = require('../models/Jasa');
const Utang = require('../models/Utang');
const Piutang = require('../models/Piutang');
const BebanUsaha = require('../models/BebanUsaha');

exports.getDashboardData = async (req, res) => {
  try {
    const tahun = req.query.tahun || new Date().getFullYear();
    console.log('Tahun yang diminta:', tahun);

    const penjualan = await Penjualan.getTotalPerBulan(tahun);
    // console.log('Penjualan:', penjualan);

    const jasa = await Jasa.getByYear(tahun);
    // console.log('Jasa:', jasa);

    const utang = await Utang.getAll();
    // console.log('Utang:', utang);

    const piutang = await Piutang.getAll();
    // console.log('Piutang:', piutang);

    const beban_usaha = await BebanUsaha.getByKategoriPerTahun(tahun);
    // console.log('Beban Usaha:', beban_usaha);

    const penjualanData = Array(12).fill(0);
    penjualan.forEach((p) => {
      penjualanData[p.bulan - 1] = Number(p.total);
    });

res.json({
  penjualan: penjualanData,
  jasa: Array.isArray(jasa) ? jasa : [jasa],
  utang: Array.isArray(utang) ? utang : [utang],
  piutang: Array.isArray(piutang) ? piutang : [piutang],
  beban_usaha: Array.isArray(beban_usaha) ? beban_usaha : [],
});
  } catch (err) {
    console.error('Gagal mengambil data dashboard:', err);
    res.status(500).json({ error: 'Gagal mengambil data dashboard' });
  }
};
