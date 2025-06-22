const bcrypt = require('bcrypt');
const User = require('../models/users');
const path = require('path');

// GET semua user
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'foto', 'created_at'],
      order: [['id', 'ASC']],
    });
    res.json(users);
  } catch (err) {
    console.error('Error saat ambil data user:', err);
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

// POST buat user
exports.create = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const foto = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';

    const user = await User.create({ email, password: hashedPassword, role, foto });
    res.status(201).json(user);
  } catch (err) {
    console.error('Error saat membuat user:', err);
    res.status(500).json({ message: 'Gagal menambahkan user' });
  }
};

// PUT update user
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role, password } = req.body;

    const updatedData = { email, role };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      updatedData.foto = `/uploads/${req.file.filename}`;
    }

    await User.update(updatedData, { where: { id } });
    res.json({ message: 'User berhasil diupdate' });
  } catch (err) {
    console.error('Error saat update user:', err);
    res.status(500).json({ message: 'Gagal update user' });
  }
};

// DELETE hapus user
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Error saat hapus user:', err);
    res.status(500).json({ message: 'Gagal hapus user' });
  }
};
