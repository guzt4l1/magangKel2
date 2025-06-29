const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bank = sequelize.define('Bank', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_bank: { type: DataTypes.STRING(100), allowNull: false },
  no_rekening: { type: DataTypes.STRING(50) },
  atas_nama: { type: DataTypes.STRING(100) }
}, {
  tableName: 'bank',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = Bank;
