const dashboardService = require('../utils/dashboardService');

exports.getDashboardData = async (req, res) => {
  try {
    const tahun = req.query.tahun || new Date().getFullYear();

    const [
      penjualan,
      jasa,
      utang,
      piutang,
      beban_usaha
    ] = await Promise.all([
      dashboardService.getTotalPenjualanPerBulan(tahun),
      dashboardService.getJasa(),
      dashboardService.getDaftarUtang(),
      dashboardService.getDaftarPiutang(),
      dashboardService.getBebanUsahaPerKategori(tahun)
    ]);

    res.json({ penjualan, jasa, utang, piutang, beban_usaha });
  } catch (err) {
    console.error('❌ Gagal ambil dashboard:', err);
    res.status(500).json({ error: 'Gagal ambil data dashboard' });
  }
};
