// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const User = require('../models/users');

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        foto: user.foto, // Optional: sertakan foto ke dalam JWT jika perlu
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        role: user.role,
        foto: user.foto, // ⬅️ Tambahkan ini
      },
    });
  } catch (error) {
  console.error("Login error:", error); // ⬅️ Tambahkan log error ini
  res.status(500).json({ message: 'Server error', error: error.message });
}
};
