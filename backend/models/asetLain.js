const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AsetLain = sequelize.define('AsetLain', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  nilai_perolehan: { type: DataTypes.DECIMAL(18,2), allowNull: false },
  tanggal_perolehan: { type: DataTypes.DATE },
  keterangan: { type: DataTypes.TEXT }
}, {
  tableName: 'aset_lain',
  freezeTableName: true,
  timestamps: true,
  underscored: true
});

module.exports = AsetLain;
