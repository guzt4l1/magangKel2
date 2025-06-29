import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Data from './pages/Data';
import Transaksi from './pages/Transaksi';
import Laporan from './pages/Laporan';
import Pengaturan from './pages/Pengaturan';
import MainLayout from './components/layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman login tanpa sidebar */}
        <Route path="/" element={<Login />} />

        {/* Halaman lain menggunakan layout */}
        {/* Semua route di bawah ini akan dilindungi oleh ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Data" element={<Data />} />
            <Route path="/Transaksi" element={<Transaksi />} />
            <Route path="/Laporan" element={<Laporan />} />
            <Route path="/Pengaturan" element={<Pengaturan />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
