//backend/models/akun.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Akun = sequelize.define('Akun', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipe: {
    type: DataTypes.ENUM('aset', 'kewajiban', 'ekuitas', 'pendapatan', 'beban'),
    allowNull: false,
  },
  is_parent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Akuns',
      key: 'id',
    },
  },
}, {
  tableName: 'Akuns',
  timestamps: false,
});

// Relasi self-join (akun bertingkat)
Akun.hasMany(Akun, { as: 'children', foreignKey: 'parent_id' });
Akun.belongsTo(Akun, { as: 'parent', foreignKey: 'parent_id' });

// Relasi ke SaldoAwal
const SaldoAwal = require('./saldoAwal'); // pastikan path-nya sesuai
Akun.hasMany(SaldoAwal, { foreignKey: 'akun_id' });
SaldoAwal.belongsTo(Akun, { foreignKey: 'akun_id' });

module.exports = Akun;
