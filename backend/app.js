const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();

// Static file
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://90ce-202-58-76-62.ngrok-free.app'//ngrok URL
  ],
  credentials: true,
}));
app.use(express.json());

// Route API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/protected', require('./routes/protectedRoutes'));
app.use('/api/beranda', require('./routes/beranda'));
app.use('/api/saldo-awal', require('./routes/saldoAwalRoutes'));
app.use('/api/akun', require('./routes/akunRoutes'));
app.use('/api/penjualan', require('./routes/penjualanRoutes'));
app.use('/api/jasa', require('./routes/jasaRoutes'));
app.use('/api/kategori-jasa', require('./routes/kategoriJasaRoutes'));
app.use('/api/pelanggan', require('./routes/pelangganRoutes'));
app.use('/api/pemasok', require('./routes/pemasokRoutes'));
app.use('/api/bank', require('./routes/bankRoutes'));
app.use('/api/aset', require('./routes/asetRoutes'));
app.use('/api/aset-lain', require('./routes/asetLainRoutes'));
app.use('/api/pemberi-pinjaman', require('./routes/pemberiPinjamanRoutes'));
app.use('/api/bank-pemberi-pinjaman', require('./routes/bankPemberiPinjamanRoutes'));
app.use('/api/beban-lain', require('./routes/bebanLainRoutes'));
app.use('/api/utang', require('./routes/utangRoutes'));
app.use('/api/piutang', require('./routes/piutang'));
app.use('/api/penerimaan-modal', require('./routes/penerimaanModalRoutes'));
app.use('/api/penarikan-bank', require('./routes/penarikanBankRoutes'));
app.use('/api/pendapatan-dimuka', require('./routes/pendapatanDimukaRoutes'));
app.use('/api/penghasilan-lain', require('./routes/penghasilanLainRoutes'));
app.use('/api/pengeluaran-kewajiban', require('./routes/pengeluaranKewajibanRoutes'));
app.use('/api/pembelian-aset', require('./routes/pembelianAsetRoutes'));
app.use('/api/pengeluaran-beban', require('./routes/pengeluaranBebanRoutes'));
app.use('/api/penghapusan-piutang', require('./routes/penghapusanPiutangRoutes'));
app.use('/api/setoran-bank', require('./routes/setoranBankRoutes'));
app.use('/api/penarikan-modal', require('./routes/penarikanModalRoutes'));
app.use('/api/transfer-rekening', require('./routes/transferRekeningRoutes'));
app.use('/api/beban-dibayar-dimuka', require('./routes/bebanDibayarDimukaRoutes'));
app.use('/api/laporan', require('./routes/laporan'));

// Sync DB
sequelize.sync().then(() => console.log('Database synced'));

module.exports = app;
