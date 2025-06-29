const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TransferRekening = sequelize.define('TransferRekening', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  akun_bank_sumber_id: { type: DataTypes.INTEGER, allowNull: false },
  akun_bank_tujuan_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  keterangan: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
  updated_by: { type: DataTypes.INTEGER }
}, {
  tableName: 'transfer_rekening',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = TransferRekening;
