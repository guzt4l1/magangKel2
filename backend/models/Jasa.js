const db = require('../config/db');

exports.getByYear = async (tahun) => {
  const results = await db.query(`
    SELECT id, nama_jasa, harga, tanggal
    FROM jasa
    WHERE YEAR(tanggal) = ?
    ORDER BY id ASC
  `, {
    replacements: [tahun],
    type: db.QueryTypes.SELECT
  });

  return results; // ✅ Langsung return array hasil query
};
