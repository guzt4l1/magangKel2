// src/components/laporan/HistoriTransaksi.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API = 'http://localhost:5000/api/laporan/histori';
const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const HistoriTransaksi = ({ onBack }) => {
  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?bulan=${bulan}&tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const exportToExcel = () => {
    const wb = utils.book_new();
    const wsData = [['Tanggal', 'Jenis', 'Akun ID', 'Jumlah', 'Keterangan']];
    data.forEach(row => {
      wsData.push([row.tanggal, row.jenis, row.akun_id, row.jumlah, row.keterangan]);
    });
    const ws = utils.aoa_to_sheet(wsData);
    utils.book_append_sheet(wb, ws, 'Histori');
    writeFile(wb, `Histori_Transaksi_${bulan}_${tahun}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Histori Transaksi - ${bulanList[bulan - 1]} ${tahun}`, 14, 15);
    doc.autoTable({
      startY: 25,
      head: [['Tanggal', 'Jenis', 'Akun ID', 'Jumlah', 'Keterangan']],
      body: data.map(r => [r.tanggal, r.jenis, r.akun_id, r.jumlah, r.keterangan]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });
    doc.save(`Histori_Transaksi_${bulan}_${tahun}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Histori Transaksi</h2>
        </div>
        <div className="flex gap-2">
          <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className="border rounded px-2 py-1">
            {bulanList.map((b, i) => (
              <option key={i + 1} value={i + 1}>{b}</option>
            ))}
          </select>
          <input
            type="number"
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="border rounded px-2 py-1 w-[100px]"
          />
          <button onClick={exportToPDF} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button onClick={exportToExcel} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
            <FileDown className="w-4 h-4" /> XLS
          </button>
        </div>
      </div>

      {data.length > 0 ? (
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-3 py-1 text-left">Tanggal</th>
              <th className="px-3 py-1 text-left">Jenis</th>
              <th className="px-3 py-1 text-left">Akun ID</th>
              <th className="px-3 py-1 text-right">Jumlah</th>
              <th className="px-3 py-1 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="bg-white shadow-sm">
                <td className="px-3 py-1">{item.tanggal}</td>
                <td className="px-3 py-1">{item.jenis}</td>
                <td className="px-3 py-1">{item.akun_id}</td>
                <td className="px-3 py-1 text-right">{Number(item.jumlah).toLocaleString()}</td>
                <td className="px-3 py-1">{item.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 py-10">Tidak ada data transaksi ditampilkan.</div>
      )}
    </div>
  );
};

export default HistoriTransaksi;
