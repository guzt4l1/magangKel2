//backend/models/saldoAwal.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SaldoAwal = sequelize.define('SaldoAwal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  akun_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tahun: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  debit: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  kredit: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'saldo_awal',
  timestamps: true,
  underscored: true
});

module.exports = SaldoAwal;
