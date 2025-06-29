const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PemberiPinjaman = sequelize.define('PemberiPinjaman', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  jenis: { type: DataTypes.ENUM('perorangan', 'lembaga', 'lainnya'), allowNull: false },
  kontak: { type: DataTypes.TEXT }
}, {
  tableName: 'pemberi_pinjaman',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = PemberiPinjaman;