import React, { useState } from 'react';
import axios from 'axios';
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


const Data = () => {
  const dataItems = [
    { id: "saldo-awal", title: "Data Saldo Awal", desc: "Saldo yang sudah ada pada saat dimulainya pencatatan transaksi keuangan", icon: <Wallet className="w-6 h-6" /> },
    { id: "jasa", title: "Data Jasa", desc: "Daftar Jasa yang diperdagangkan/ dijual kepada pelanggan", icon: <FileText className="w-6 h-6" /> },
    { id: "kategori-jasa", title: "Data Kategori Jasa", desc: "Daftar Kategori untuk pengelompokan barang/jasa", icon: <Tags className="w-6 h-6" /> },
    { id: "mata-uang", title: "Data Mata Uang", desc: "Daftar Mata Uang yang digunakan dalam operasional", icon: <BadgeDollarSign className="w-6 h-6" /> },
    { id: "pelanggan", title: "Data Pelanggan", desc: "Pihak yang membeli barang atau jasa", icon: <Users className="w-6 h-6" /> },
    { id: "pemasok", title: "Data Pemasok", desc: "Pihak yang menjual barang atau jasa", icon: <Truck className="w-6 h-6" /> },
    { id: "bank", title: "Data Bank", desc: "Bank untuk transaksi pemasukan dan pengeluaran", icon: <Building className="w-6 h-6" /> },
    { id: "aset", title: "Data Aset", desc: "Aset tetap/non-tetap untuk operasional", icon: <BarChart className="w-6 h-6" /> },
    { id: "aset-lain", title: "Data Aset Lain", desc: "Aset lain dalam kegiatan operasional", icon: <ClipboardList className="w-6 h-6" /> },
    { id: "pemberi-pinjaman", title: "Data Pemberi Pinjaman", desc: "Pihak untuk transaksi utang non-bank", icon: <UserCheck className="w-6 h-6" /> },
    { id: "bank-pemberi-pinjaman", title: "Data Bank Pemberi Pinjaman", desc: "Bank pemberi utang", icon: <Landmark className="w-6 h-6" /> },
    { id: "beban-lain", title: "Data Beban Lain", desc: "Beban lain yang digunakan dalam transaksi", icon: <Folder className="w-6 h-6" /> },
  ];


  const [selectedId, setSelectedId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (id) => {
    setSelectedId(id);
    setLoading(true);
    try {
      const response = await axios.get(`/api/${id}`);
      const result = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setTableData(result);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">DATA</h1>
      </div>

      {/* Grid dengan latar putih seperti Laporan.jsx */}
      <div className="p-6 mt-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-xl">
        {dataItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(item.id)}
            className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
          >
            {/* Icon kanan atas */}
            <div className="absolute top-3 right-3 text-gray-300 text-xl">
              {item.icon}
            </div>

            {/* Judul */}
            <h2 className="text-sm font-semibold mb-1 mr-6 leading-snug">
              {item.title}
            </h2>
            {/* Deskripsi */}
            {item.desc && (
              <p className="text-xs text-yellow-300">{item.desc}</p>
            )}
          </button>
        ))}
      </div>

      {/* Tabel */}
      {selectedId && (
        <div className="mt-10 mx-6 bg-white p-5 rounded shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 capitalize">
            Tabel {selectedId.replace(/-/g, ' ')}
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(tableData[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-2 border text-left font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2 border">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-black">Data tidak tersedia.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Data;
