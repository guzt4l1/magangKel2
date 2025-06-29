const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BebanDibayarDimuka = sequelize.define('BebanDibayarDimuka', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  akun_beban_dimuka_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'beban_dibayar_dimuka',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = BebanDibayarDimuka;
