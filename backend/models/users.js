// backend/models/users.js
const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'staff',
  },
  foto: {
    type: DataTypes.STRING(255),
    defaultValue: '/uploads/default.jpg',
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'aktif',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: db.literal('CURRENT_TIMESTAMP'),
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Users',          
  freezeTableName: true,       
  timestamps: false,
  underscored: true
});

module.exports = User;
