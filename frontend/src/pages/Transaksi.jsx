import React from 'react';
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

const dataTransaksi = {
  penerimaan: [
    { title: 'Penjualan', desc: 'Transaksi menjual barang atau produk kepada pelanggan.', icon: <DollarSign /> },
    { title: 'Utang', desc: 'Pinjaman dana dari kreditur yang harus dikembalikan.', icon: <CreditCard /> },
    { title: 'Modal', desc: 'Uang atau barang yang disetor oleh pemilik usaha.', icon: <PiggyBank /> },
    { title: 'Penarikan Dari Bank', desc: 'Penerimaan dana hasil penarikan dari rekening bank.', icon: <Banknote /> },
    { title: 'Pendapatan Diterima Dimuka', desc: 'Pendapatan yang diterima sebelum jasa dilakukan.', icon: <ReceiptText /> },
    { title: 'Penghasilan Lain', desc: 'Pendapatan selain dari penjualan utama.', icon: <Coins /> },
  ],
  pengeluaran: [
    { title: 'Kewajiban', desc: 'Pembayaran utang atau kewajiban lainnya.', icon: <HandCoins /> },
    { title: 'Pembelian Aset', desc: 'Pengeluaran untuk membeli aset seperti kendaraan, gedung, dll.', icon: <Building2 /> },
    { title: 'Beban', desc: 'Beban operasional yang harus dikeluarkan oleh usaha.', icon: <FileText /> },
    { title: 'Penghapusan Piutang', desc: 'Menghapus piutang yang tidak bisa ditagih.', icon: <ShieldCheck /> },
    { title: 'Setoran Ke Bank', desc: 'Menyetorkan uang tunai ke rekening bank.', icon: <Landmark /> },
    { title: 'Penarikan Modal', desc: 'Penarikan dana oleh pemilik dari usaha.', icon: <PiggyBank /> },
    { title: 'Pemindahan Saldo Rekening', desc: 'Pemindahan saldo antar rekening bank.', icon: <Wallet /> },
    { title: 'Beban Dibayar Dimuka', desc: 'Pembayaran beban untuk periode berikutnya.', icon: <FileText /> },
  ],
};

const Transaksi = () => {
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
              className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
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
              className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
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
