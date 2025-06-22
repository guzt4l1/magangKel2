const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // pastikan ini adalah koneksi Sequelize-mu

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'staff',
  },
  foto: {
    type: DataTypes.STRING(255),
    defaultValue: '/uploads/default.jpg',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User;
