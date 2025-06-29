const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pemasok = sequelize.define('Pemasok', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  telepon: { type: DataTypes.STRING(20) },
  alamat: { type: DataTypes.TEXT },
  npwp: { type: DataTypes.STRING(30) },
  kontak_pic: { type: DataTypes.STRING(100) }
}, {
  tableName: 'pemasok',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = Pemasok;
