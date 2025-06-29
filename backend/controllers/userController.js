const bcrypt = require('bcrypt');
const User = require('../models/users');

// GET semua user
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nama', 'email', 'role', 'foto', 'status', 'created_at', 'last_login'],
      order: [['id', 'ASC']],
    });
    return res.json(users);
  } catch (err) {
    console.error('Error saat ambil data user:', err);
    return res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

// POST buat user
exports.create = async (req, res) => {
  try {
    const { nama, email, password, role, status } = req.body;

    // Validasi wajib isi
    if (!nama || !email || !password || !role) {
      return res.status(400).json({ message: 'Nama, email, password, dan role wajib diisi' });
    }

    // Cek email unik
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foto = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';

    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      role,
      foto,
      status: status || 'aktif',
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error('Error saat membuat user:', err);
    return res.status(500).json({ message: 'Gagal menambahkan user', error: err.message });
  }
};

// PUT update user
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, role, status, password } = req.body;

    // Validasi minimum
    if (!nama || !email || !role) {
      return res.status(400).json({ message: 'Nama, email, dan role wajib diisi' });
    }

    const updatedData = { nama, email, role, status };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updatedData.foto = `/uploads/${req.file.filename}`;
    }

    await User.update(updatedData, { where: { id } });
    return res.json({ message: 'User berhasil diupdate' });
  } catch (err) {
    console.error('Error saat update user:', err);
    return res.status(500).json({ message: 'Gagal update user', error: err.message });
  }
};

// DELETE hapus user
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Error saat hapus user:', err);
    return res.status(500).json({ message: 'Gagal hapus user', error: err.message });
  }
};
