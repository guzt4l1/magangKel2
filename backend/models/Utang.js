const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');

exports.getAll = async () => {
  const res = await sequelize.query(`
    SELECT id, keterangan, jumlah, jatuh_tempo
    FROM utang
    ORDER BY id ASC
  `, {
    type: QueryTypes.SELECT,
  });
  return res;
};
