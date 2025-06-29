// models/penjualan.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Penjualan = db.define('Penjualan', {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  pelanggan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  akun_piutang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  akun_penjualan_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bukti: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  metode_pembayaran: {
  type: DataTypes.STRING(20),
  allowNull: false,
  defaultValue: 'tunai'
},
}, {
  tableName: 'penjualan',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Penjualan;