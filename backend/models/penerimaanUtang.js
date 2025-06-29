const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PenerimaanUtang = sequelize.define('PenerimaanUtang', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  pemberi_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_kas_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_utang_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  bukti: { type: DataTypes.STRING(255) },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'penerimaan_utang',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PenerimaanUtang;
