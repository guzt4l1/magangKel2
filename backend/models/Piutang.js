const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getAll = async () => {
  const res = await sequelize.query(`
    SELECT id, nama_pelanggan, jumlah, tanggal_transaksi
    FROM piutang
    ORDER BY id ASC
  `, {
    type: QueryTypes.SELECT,
  });
  return res;
};
