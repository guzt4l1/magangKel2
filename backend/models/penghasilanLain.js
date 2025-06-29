const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PenghasilanLain = sequelize.define('PenghasilanLain', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_pendapatan_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'penghasilan_lain',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PenghasilanLain;
