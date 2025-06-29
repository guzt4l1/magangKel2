import React, { useState } from 'react';
import {
  Wallet,
  FileText,
  Tags,
  BadgeDollarSign,
  Users,
  Truck,
  Building,
  BarChart,
  ClipboardList,
  UserCheck,
  Landmark,
  Folder,
} from 'lucide-react';

import DataSaldoAwal from '../components/data/DataSaldoAwal';
import DataJasa from '../components/data/DataJasa'; 
import DataKategoriJasa from '../components/data/DataKategoriJasa';
import DataPelanggan from '../components/data/DataPelanggan';
import DataPemasok from '../components/data/DataPemasok';
import DataBank from '../components/data/DataBank';
import DataAset from '../components/data/DataAset';
import DataAsetLain from '../components/data/DataAsetLain';
import DataPemberiPinjaman from '../components/data/DataPemberiPinjaman';
import DataBankPemberiPinjaman from '../components/data/DataBankPemberiPinjaman';
import DataBebanLain from '../components/data/DataBebanLain';
import DataAkun from '../components/data/DataAkun';

const Data = () => {
  const [fiturAktif, setFiturAktif] = useState(null); 

const dataItems = [
  {
    id: 'saldo-awal',
    title: 'Data Saldo Awal',
    desc: 'Saldo yang sudah ada pada saat dimulainya pencatatan transaksi keuangan',
    icon: <Wallet className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('saldoAwal'),
  },
  {
    id: 'jasa',
    title: 'Data Jasa',
    desc: 'Daftar Jasa yang diperdagangkan/ dijual kepada pelanggan',
    icon: <FileText className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('jasa'),
  },
  {
    id: 'kategori-jasa',
    title: 'Data Kategori Jasa',
    desc: 'Daftar Kategori untuk pengelompokan barang/jasa',
    icon: <Tags className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('kategoriJasa'),
  },
  {
    id: 'pelanggan',
    title: 'Data Pelanggan',
    desc: 'Pihak yang membeli barang atau jasa',
    icon: <Users className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('pelanggan'),
  },
  {
    id: 'pemasok',
    title: 'Data Pemasok',
    desc: 'Pihak yang menjual barang atau jasa',
    icon: <Truck className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('pemasok'),
  },
  {
    id: 'bank',
    title: 'Data Bank',
    desc: 'Bank untuk transaksi pemasukan dan pengeluaran',
    icon: <Building className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('bank'),
  },
  {
    id: 'aset',
    title: 'Data Aset',
    desc: 'Aset tetap/non-tetap untuk operasional',
    icon: <BarChart className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('aset'),
  },
  {
    id: 'aset-lain',
    title: 'Data Aset Lain',
    desc: 'Aset lain dalam kegiatan operasional',
    icon: <ClipboardList className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('asetLain'),
  },
  {
    id: 'pemberi-pinjaman',
    title: 'Data Pemberi Pinjaman',
    desc: 'Pihak untuk transaksi utang non-bank',
    icon: <UserCheck className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('pemberiPinjaman'),
  },
  {
    id: 'bank-pemberi-pinjaman',
    title: 'Data Bank Pemberi Pinjaman',
    desc: 'Bank pemberi utang',
    icon: <Landmark className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('bankPemberiPinjaman'),
  },
  {
    id: 'beban-lain',
    title: 'Data Beban Lain',
    desc: 'Beban lain yang digunakan dalam transaksi',
    icon: <Folder className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('bebanLain'),
  },
  {
    id: 'akun',
    title: 'Data Akun',
    desc: 'Daftar akun buku besar untuk pencatatan transaksi',
    icon: <Folder className="w-6 h-6 text-blue-200" />,
    onClick: () => setFiturAktif('akun'),
  }
];


  const renderFitur = () => {
    switch (fiturAktif) {
      case 'saldoAwal':
        return <DataSaldoAwal onBack={() => setFiturAktif(null)} />;
      case 'jasa':
        return <DataJasa onBack={() => setFiturAktif(null)} />;
      case 'kategoriJasa':
        return <DataKategoriJasa onBack={() => setFiturAktif(null)} />;
      case 'pelanggan':
        return <DataPelanggan onBack={() => setFiturAktif(null)} />;
      case 'pemasok':
        return <DataPemasok onBack={() => setFiturAktif(null)} />;
      case 'bank':
        return <DataBank onBack={() => setFiturAktif(null)} />;
      case 'aset':
        return <DataAset onBack={() => setFiturAktif(null)} />;
      case 'asetLain':
        return <DataAsetLain onBack={() => setFiturAktif(null)} />;
      case 'pemberiPinjaman':
        return <DataPemberiPinjaman onBack={() => setFiturAktif(null)} />;
      case 'bankPemberiPinjaman':
        return <DataBankPemberiPinjaman onBack={() => setFiturAktif(null)} />;
      case 'bebanLain':
        return <DataBebanLain onBack={() => setFiturAktif(null)} />;
      case 'akun':
        return <DataAkun onBack={() => setFiturAktif(null)} />;
      default:
        return (
          <div className="text-center p-6 text-gray-600">
            <p>Fitur <strong>{fiturAktif}</strong> belum tersedia.</p>
            <button
              onClick={() => setFiturAktif(null)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Kembali
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-4">DATA</h1>

      {fiturAktif === null ? (
        <div className="p-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-xl">
          {dataItems.map((item, idx) => (
            <div
              key={idx}
              onClick={item.onClick || (() => {})}
              className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px] cursor-pointer"
            >
              <div className="absolute top-3 right-3 text-gray-300 text-xl">
                {item.icon}
              </div>
              <h2 className="text-sm font-semibold mb-1 mr-6 leading-snug">
                {item.title}
              </h2>
              {item.desc && (
                <p className="text-xs text-yellow-300">{item.desc}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6">{renderFitur()}</div>
      )}
    </div>
  );
};

export default Data;
