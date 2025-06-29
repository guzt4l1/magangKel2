// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

    // Cek status aktif
    if (user.status !== 'aktif') {
      return res.status(403).json({ message: 'Akun tidak aktif. Hubungi admin.' });
    }

    // Update last_login
    await User.update(
      { last_login: new Date() },
      { where: { id: user.id } }
    );

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        nama: user.nama,
        foto: user.foto,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Kirim respons ke frontend
    res.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        foto: user.foto,
        last_login: user.last_login,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
