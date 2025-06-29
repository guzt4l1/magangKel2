const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PendapatanDimuka = sequelize.define('PendapatanDimuka', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  pelanggan_id: { type: DataTypes.INTEGER },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_pendapatan_dimuka_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT }
}, {
  tableName: 'pendapatan_dimuka',
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = PendapatanDimuka;
