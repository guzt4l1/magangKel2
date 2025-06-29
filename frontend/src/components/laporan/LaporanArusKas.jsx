import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API = 'http://localhost:5000/api/laporan/arus-kas';
const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const LaporanArusKas = ({ onBack }) => {
  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?bulan=${bulan}&tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const exportToExcel = () => {
    const wb = utils.book_new();
    ['operasi', 'investasi', 'pendanaan'].forEach(tipe => {
      const wsData = [['Tanggal', 'Keterangan', 'Masuk', 'Keluar']];
      data[tipe].forEach(row => {
        wsData.push([row.tanggal, row.keterangan, row.masuk, row.keluar]);
      });
      const ws = utils.aoa_to_sheet(wsData);
      utils.book_append_sheet(wb, ws, tipe.toUpperCase());
    });
    writeFile(wb, `Laporan_Arus_Kas_${bulan}_${tahun}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Laporan Arus Kas - ${bulanList[bulan - 1]} ${tahun}`, 14, 15);

    let startY = 25;
    ['operasi', 'investasi', 'pendanaan'].forEach(tipe => {
      doc.setFontSize(12);
      doc.text(tipe.toUpperCase(), 14, startY);
      doc.autoTable({
        startY: startY + 5,
        head: [['Tanggal', 'Keterangan', 'Masuk', 'Keluar']],
        body: data[tipe].map(row => [
          row.tanggal,
          row.keterangan,
          row.masuk.toLocaleString(),
          row.keluar.toLocaleString(),
        ]),
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
        theme: 'grid',
      });
      startY = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`Laporan_Arus_Kas_${bulan}_${tahun}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Laporan Arus Kas</h2>
        </div>
        <div className="flex gap-2">
          <select value={bulan} onChange={(e) => setBulan(Number(e.target.value))} className="border rounded px-2 py-1">
            {bulanList.map((b, i) => <option key={i + 1} value={i + 1}>{b}</option>)}
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

      {data ? (
        <div className="space-y-6">
          {['operasi', 'investasi', 'pendanaan'].map((tipe) => (
            <div key={tipe}>
              <h3 className="font-semibold text-lg capitalize mb-2">{tipe}</h3>
              <table className="w-full text-sm border-separate border-spacing-y-1">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-1 text-left">Tanggal</th>
                    <th className="px-3 py-1 text-left">Keterangan</th>
                    <th className="px-3 py-1 text-right">Masuk</th>
                    <th className="px-3 py-1 text-right">Keluar</th>
                  </tr>
                </thead>
                <tbody>
                  {data[tipe].map((item, i) => (
                    <tr key={i} className="bg-white shadow-sm">
                      <td className="px-3 py-1">{item.tanggal}</td>
                      <td className="px-3 py-1">{item.keterangan}</td>
                      <td className="px-3 py-1 text-right">{Number(item.masuk).toLocaleString()}</td>
                      <td className="px-3 py-1 text-right">{Number(item.keluar).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-sm font-medium mt-2 text-right">
                Total {tipe.charAt(0).toUpperCase() + tipe.slice(1)}:{' '}
                <span className="text-blue-800">
                  {(data[`total_${tipe}`] || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">Tidak ada data ditampilkan.</div>
      )}
    </div>
  );
};

export default LaporanArusKas;
