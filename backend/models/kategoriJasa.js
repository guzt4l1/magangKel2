const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KategoriJasa = sequelize.define('KategoriJasa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false }
}, {
  tableName: 'kategori_jasa',
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = KategoriJasa;