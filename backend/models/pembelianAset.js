const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PembelianAset = sequelize.define('PembelianAset', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  aset_id: { type: DataTypes.INTEGER, allowNull: false },
  pemasok_id: { type: DataTypes.INTEGER },
  akun_aset_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  bukti: { type: DataTypes.STRING(255) },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'pembelian_aset',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PembelianAset;
