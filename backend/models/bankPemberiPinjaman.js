const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BankPemberiPinjaman = sequelize.define('BankPemberiPinjaman', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pemberi_id: { type: DataTypes.INTEGER, allowNull: false },
  bank_id: { type: DataTypes.INTEGER, allowNull: false },
  no_rekening: { type: DataTypes.STRING(50) }
}, {
  tableName: 'bank_pemberi_pinjaman',
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = BankPemberiPinjaman;
