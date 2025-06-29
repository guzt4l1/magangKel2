const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Piutang = sequelize.define('Piutang', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pelanggan_id: { type: DataTypes.INTEGER, allowNull: false },
  tanggal_transaksi: { type: DataTypes.DATEONLY, allowNull: false },
  jatuh_tempo: { type: DataTypes.DATEONLY },
  no_invoice: { type: DataTypes.STRING(50) },
  total: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  sisa_tagihan: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  akun_piutang_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_penjualan_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_ppn_id: { type: DataTypes.INTEGER },
  keterangan: { type: DataTypes.TEXT },
  bukti: { type: DataTypes.STRING(255) },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'piutang',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = Piutang;
