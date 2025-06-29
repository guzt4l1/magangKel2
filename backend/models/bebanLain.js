const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BebanLain = sequelize.define('BebanLain', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  akun_beban_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'beban_lain',
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

module.exports = BebanLain;
