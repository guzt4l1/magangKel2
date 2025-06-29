const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PengeluaranKewajiban = sequelize.define('PengeluaranKewajiban', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  utang_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah_bayar: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  bukti: { type: DataTypes.STRING(255) },
  keterangan: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'pengeluaran_kewajiban',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PengeluaranKewajiban;
