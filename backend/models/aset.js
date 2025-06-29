const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Aset = sequelize.define('Aset', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  jenis: { type: DataTypes.STRING(50) },
  nilai_perolehan: { type: DataTypes.DECIMAL(18,2), allowNull: false },
  tanggal_perolehan: { type: DataTypes.DATE },
  umur_ekonomis: { type: DataTypes.INTEGER },
  keterangan: { type: DataTypes.TEXT }
}, {
  tableName: 'aset',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = Aset;
