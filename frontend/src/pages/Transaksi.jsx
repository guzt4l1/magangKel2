import React, { useState } from 'react';
import {
  DollarSign,
  Banknote,
  PiggyBank,
  Coins,
  Building2,
  FileText,
  Wallet,
  HandCoins,
  CreditCard,
  Landmark,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';

import DataPenjualan from '../components/transaksi/Penjualan';
import DataUtang from '../components/transaksi/Utang';
import DataModal from '../components/transaksi/Modal';
import DataPenarikanBank from '../components/transaksi/PenarikanBank';
import DataPendapatanDimuka from '../components/transaksi/pendapatanDimuka';
import DataPenghasilanLain from '../components/transaksi/PenghasilanLain';
import DataKewajiban from '../components/transaksi/PengeluaranKewajiban';
import DataPembelianAset from '../components/transaksi/PembelianAset';
import DataBeban from '../components/transaksi/PengeluaranBeban';
import DataPenghapusanPiutang from '../components/transaksi/PenghapusanPiutang';
import DataSetoranBank from '../components/transaksi/SetoranBank';
import DataPenarikanModal from '../components/transaksi/PenarikanModal';
import TransferRekening from '../components/transaksi/TransferRekening';
import BebanDibayarDimuka from '../components/transaksi/BebanDibayarDimuka';

const Transaksi = () => {
  const [fiturAktif, setFiturAktif] = useState(null);

  const dataTransaksi = {
    penerimaan: [
      {
        id: 'penjualan',
        title: 'Penjualan',
        desc: 'Transaksi menjual barang atau produk kepada pelanggan.',
        icon: <DollarSign />,
        onClick: () => setFiturAktif('penjualan'),
      },
      {
        id: 'utang',
        title: 'Utang',
        desc: 'Pinjaman dana dari kreditur yang harus dikembalikan.',
        icon: <CreditCard />,
        onClick: () => setFiturAktif('utang'),
      },
      {
        id: 'modal',
        title: 'Modal',
        desc: 'Uang atau barang yang disetor oleh pemilik usaha.',
        icon: <PiggyBank />,
        onClick: () => setFiturAktif('modal'),
      },
      {
        id: 'penarikanBank',
        title: 'Penarikan Dari Bank',
        desc: 'Penerimaan dana hasil penarikan dari rekening bank.',
        icon: <Banknote />,
        onClick: () => setFiturAktif('penarikanBank'),
      },
      {
        id: 'pendapatanDimuka',
        title: 'Pendapatan Diterima Dimuka',
        desc: 'Pendapatan yang diterima sebelum jasa dilakukan.',
        icon: <ReceiptText />,
        onClick: () => setFiturAktif('pendapatanDimuka'),
      },
      {
        id: 'penghasilanLain',
        title: 'Penghasilan Lain',
        desc: 'Pendapatan selain dari penjualan utama.',
        icon: <Coins />,
        onClick: () => setFiturAktif('penghasilanLain'),
      },
    ],
    pengeluaran: [
      {
        id: 'kewajiban',
        title: 'Kewajiban',
        desc: 'Pembayaran utang atau kewajiban lainnya.',
        icon: <HandCoins />,
        onClick: () => setFiturAktif('kewajiban'),
      },
      {
        id: 'pembelianAset',
        title: 'Pembelian Aset',
        desc: 'Pengeluaran untuk membeli aset seperti kendaraan, gedung, dll.',
        icon: <Building2 />,
        onClick: () => setFiturAktif('pembelianAset'),
      },
      {
        id: 'beban',
        title: 'Beban',
        desc: 'Beban operasional yang harus dikeluarkan oleh usaha.',
        icon: <FileText />,
        onClick: () => setFiturAktif('beban'),
      },
      {
        id: 'penghapusanPiutang',
        title: 'Penghapusan Piutang',
        desc: 'Menghapus piutang yang tidak bisa ditagih.',
        icon: <ShieldCheck />,
        onClick: () => setFiturAktif('penghapusanPiutang'),
      },
      {
        id: 'setoranBank',
        title: 'Setoran Ke Bank',
        desc: 'Menyetorkan uang tunai ke rekening bank.',
        icon: <Landmark />,
        onClick: () => setFiturAktif('setoranBank'),
      },
      {
        id: 'penarikanModal',
        title: 'Penarikan Modal',
        desc: 'Penarikan dana oleh pemilik dari usaha.',
        icon: <PiggyBank />,
        onClick: () => setFiturAktif('penarikanModal'),
      },
      {
        id: 'pemindahanSaldo',
        title: 'Pemindahan Saldo Rekening',
        desc: 'Pemindahan saldo antar rekening bank.',
        icon: <Wallet />,
        onClick: () => setFiturAktif('pemindahanSaldo'),
      },
      {
        id: 'bebanDimuka',
        title: 'Beban Dibayar Dimuka',
        desc: 'Pembayaran beban untuk periode berikutnya.',
        icon: <FileText />,
        onClick: () => setFiturAktif('bebanDimuka'),
      },
    ],
  };

  // Render komponen berdasarkan fitur aktif
  const renderKomponenAktif = () => {
    switch (fiturAktif) {
      case 'penjualan':
        return <DataPenjualan onBack={() => setFiturAktif(null)} />;
      case 'utang':
        return <DataUtang onBack={() => setFiturAktif(null)} />;
      case 'modal':
        return <DataModal onBack={() => setFiturAktif(null)} />;
      case 'penarikanBank':
        return <DataPenarikanBank onBack={() => setFiturAktif(null)} />;
      case 'pendapatanDimuka':
        return <DataPendapatanDimuka onBack={() => setFiturAktif(null)} />;
      case 'penghasilanLain':
        return <DataPenghasilanLain onBack={() => setFiturAktif(null)} />;
      case 'kewajiban':
        return <DataKewajiban onBack={() => setFiturAktif(null)} />;
      case 'pembelianAset':
        return <DataPembelianAset onBack={() => setFiturAktif(null)} />;
      case 'beban':
        return <DataBeban onBack={() => setFiturAktif(null)} />;
      case 'penghapusanPiutang':
        return <DataPenghapusanPiutang onBack={() => setFiturAktif(null)} />;
      case 'setoranBank':
        return <DataSetoranBank onBack={() => setFiturAktif(null)} />;
      case 'penarikanModal':
        return <DataPenarikanModal onBack={() => setFiturAktif(null)} />;
      case 'pemindahanSaldo':
        return <TransferRekening onBack={() => setFiturAktif(null)} />;
      case 'bebanDimuka':
        return <BebanDibayarDimuka onBack={() => setFiturAktif(null)} />;
      default:
        return null;
    }
  };

  if (fiturAktif) {
    return <div className="p-4">{renderKomponenAktif()}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-2">TRANSAKSI</h1>

      {/* PENERIMAAN */}
      <div className="p-6 bg-white rounded-lg mt-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Penerimaan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataTransaksi.penerimaan.map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className="relative cursor-pointer bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
            >
              <div className="absolute top-3 right-3 text-gray-300">{item.icon}</div>
              <h3 className="text-sm font-semibold mb-1 mr-6 leading-snug">{item.title}</h3>
              <p className="text-xs text-yellow-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PENGELUARAN */}
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Pengeluaran</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataTransaksi.pengeluaran.map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick}
              className="relative cursor-pointer bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
            >
              <div className="absolute top-3 right-3 text-gray-300">{item.icon}</div>
              <h3 className="text-sm font-semibold mb-1 mr-6 leading-snug">{item.title}</h3>
              <p className="text-xs text-yellow-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transaksi;
