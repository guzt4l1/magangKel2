const db = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getTotalPerBulan = async (tahun) => {
  const rows = await db.query(`
    SELECT bulan, SUM(total_penjualan) AS total
    FROM penjualan
    WHERE tahun = ?
    GROUP BY bulan
    ORDER BY bulan
  `, {
    replacements: [tahun],
    type: QueryTypes.SELECT,
  });

  return rows; // ✅ rows sudah array of objects seperti: [{ bulan: 1, total: 1000 }, ...]
};
