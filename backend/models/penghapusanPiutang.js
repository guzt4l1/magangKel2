const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PenghapusanPiutang = sequelize.define('PenghapusanPiutang', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  piutang_id: { type: DataTypes.INTEGER, allowNull: false },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  akun_penghapusan_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'penghapusan_piutang',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PenghapusanPiutang;
