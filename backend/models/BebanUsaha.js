const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getByKategoriPerTahun = async (tahun) => {
  const res = await sequelize.query(`
    SELECT kategori, SUM(jumlah) AS jumlah
    FROM beban_usaha
    WHERE tahun = ?
    GROUP BY kategori
  `, {
    replacements: [tahun],
    type: QueryTypes.SELECT,
  });
  return res;
};
