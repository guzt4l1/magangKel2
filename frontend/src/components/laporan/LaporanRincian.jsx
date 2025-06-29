// components/laporan/LaporanRincian.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const API = 'http://localhost:5000/api/laporan/rincian';

const LaporanRincian = ({ onBack }) => {
  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?bulan=${bulan}&tahun=${tahun}`);
      setData(res.data.transaksi || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const exportToExcel = () => {
    const wsData = [
      ['Tanggal', 'Akun ID', 'Sumber', 'Keterangan', 'Debit', 'Kredit'],
      ...data.map((row) => [
        row.tanggal,
        row.akun_id,
        row.sumber,
        row.keterangan,
        row.debit,
        row.kredit,
      ])
    ];
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet(wsData);
    utils.book_append_sheet(wb, ws, 'RINCIAN');
    writeFile(wb, `Laporan_Rincian_${bulan}_${tahun}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Laporan Rincian Transaksi - ${bulanList[bulan - 1]} ${tahun}`, 14, 15);

    doc.autoTable({
      startY: 25,
      head: [['Tanggal', 'Akun ID', 'Sumber', 'Keterangan', 'Debit', 'Kredit']],
      body: data.map(row => [
        row.tanggal,
        row.akun_id,
        row.sumber,
        row.keterangan,
        row.debit,
        row.kredit
      ]),
      theme: 'grid',
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });

    doc.save(`Laporan_Rincian_${bulan}_${tahun}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Laporan Rincian</h2>
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
        <div className="overflow-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
              <tr>
                <th className="px-3 py-1 text-left">Tanggal</th>
                <th className="px-3 py-1 text-left">Akun ID</th>
                <th className="px-3 py-1 text-left">Sumber</th>
                <th className="px-3 py-1 text-left">Keterangan</th>
                <th className="px-3 py-1 text-right">Debit</th>
                <th className="px-3 py-1 text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="bg-white shadow-sm">
                  <td className="px-3 py-1">{item.tanggal}</td>
                  <td className="px-3 py-1">{item.akun_id}</td>
                  <td className="px-3 py-1">{item.sumber}</td>
                  <td className="px-3 py-1">{item.keterangan}</td>
                  <td className="px-3 py-1 text-right">{Number(item.debit).toLocaleString()}</td>
                  <td className="px-3 py-1 text-right">{Number(item.kredit).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">Tidak ada data ditampilkan.</div>
      )}
    </div>
  );
};

export default LaporanRincian;
