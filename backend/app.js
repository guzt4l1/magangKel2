// backend/app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');        
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const berandaRoutes = require('./routes/beranda');
const saldoAwalRoutes = require('./routes/saldoAwalRoutes');
const akunRoutes = require('./routes/akunRoutes'); 
const penjualanRoutes = require('./routes/penjualanRoutes');
const jasaRoutes = require('./routes/jasaRoutes');
const kategoriJasaRoutes = require('./routes/kategoriJasaRoutes');
const pelangganRoutes = require('./routes/pelangganRoutes');
const pemasokRoutes = require('./routes/pemasokRoutes');
const bankRoutes = require('./routes/bankRoutes');
const asetRoutes = require('./routes/asetRoutes');
const asetLainRoutes = require('./routes/asetLainRoutes');
const pemberiPinjamanRoutes = require('./routes/pemberiPinjamanRoutes');
const bankPemberiPinjamanRoutes = require('./routes/bankPemberiPinjamanRoutes');
const bebanLainRoutes = require('./routes/bebanLainRoutes');
const utangRoutes = require('./routes/utangRoutes');
const piutangRoutes = require('./routes/piutang');
const penerimaanModalRoutes = require('./routes/penerimaanModalRoutes');
const penarikanBankRoutes = require('./routes/penarikanBankRoutes');
const pendapatanDimukaRoutes = require('./routes/pendapatanDimukaRoutes');
const PenghasilanLainRoutes = require('./routes/penghasilanLainRoutes');
const PengeluaranKewajibanRoutes = require('./routes/pengeluaranKewajibanRoutes'); 
const PembelianAsetRoutes = require('./routes/pembelianAsetRoutes'); 
const PengeluaranBebanRoutes = require('./routes/pengeluaranBebanRoutes');
const PenghapusanPiutangRoutes = require('./routes/penghapusanPiutangRoutes');
const SetoranBankRoutes = require('./routes/setoranBankRoutes'); 
const PenarikanModalRoutes = require('./routes/penarikanModalRoutes');
const TransferRekeningRoutes = require('./routes/transferRekeningRoutes');
const BebanDibayarDimukaRoutes = require('./routes/bebanDibayarDimukaRoutes');
const laporanRoute = require('./routes/laporan');

const sequelize = require('./config/db');
require('dotenv').config();


const app = express();

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/saldo-awal', saldoAwalRoutes);
app.use('/api/users', userRoutes);           
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/beranda', berandaRoutes);
app.use('/api/akun', akunRoutes); 
app.use('/api/penjualan', penjualanRoutes);
app.use('/api/jasa', jasaRoutes);
app.use('/api/kategori-jasa', kategoriJasaRoutes);
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/pemasok', pemasokRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/aset', asetRoutes);
app.use('/api/aset-lain', asetLainRoutes);
app.use('/api/pemberi-pinjaman', pemberiPinjamanRoutes);
app.use('/api/bank-pemberi-pinjaman', bankPemberiPinjamanRoutes);
app.use('/api/beban-lain', bebanLainRoutes);
app.use('/api/utang', utangRoutes);
app.use('/api/piutang', piutangRoutes);
app.use('/api/penerimaan-modal', penerimaanModalRoutes);
app.use('/api/penarikan-bank', penarikanBankRoutes);
app.use('/api/pendapatan-dimuka', pendapatanDimukaRoutes);
app.use('/api/penghasilan-lain', PenghasilanLainRoutes); 
app.use('/api/pengeluaran-kewajiban', PengeluaranKewajibanRoutes); 
app.use('/api/pembelian-aset', PembelianAsetRoutes);
app.use('/api/pengeluaran-beban', PengeluaranBebanRoutes);
app.use('/api/penghapusan-piutang', PenghapusanPiutangRoutes); 
app.use('/api/setoran-bank', SetoranBankRoutes);
app.use('/api/penarikan-modal', PenarikanModalRoutes);
app.use('/api/transfer-rekening', TransferRekeningRoutes);
app.use('/api/beban-dibayar-dimuka', BebanDibayarDimukaRoutes);
app.use('/api/laporan', laporanRoute);
// Sync database
sequelize.sync().then(() => console.log('Database synced'));

module.exports = app;