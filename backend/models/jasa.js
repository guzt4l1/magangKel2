const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Jasa = sequelize.define('Jasa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  harga: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  kategori_id: { type: DataTypes.INTEGER },
  akun_penjualan_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'jasa',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = Jasa;
