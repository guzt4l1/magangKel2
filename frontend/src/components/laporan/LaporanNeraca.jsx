import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, FileText, FileDown } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const API = 'http://localhost:5000/api/laporan/neraca';

const bulanList = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const LaporanNeraca = ({ onBack }) => {
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
      setData(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan, tahun]);

  const exportToExcel = () => {
    const wb = utils.book_new();

    ['aset', 'kewajiban', 'ekuitas'].forEach((tipe) => {
      const wsData = [['Kode', 'Nama', 'Saldo']];
      data[tipe].forEach(item => {
        wsData.push([item.kode, item.nama, item.saldo]);
      });
      const ws = utils.aoa_to_sheet(wsData);
      utils.book_append_sheet(wb, ws, tipe.toUpperCase());
    });

    writeFile(wb, `Laporan_Neraca_${bulan}_${tahun}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Laporan Neraca - ${bulanList[bulan - 1]} ${tahun}`, 14, 15);

    let startY = 25;
    ['aset', 'kewajiban', 'ekuitas'].forEach((tipe) => {
      doc.setFontSize(12);
      doc.text(tipe.toUpperCase(), 14, startY);
      autoTable(doc, {
        startY: startY + 5,
        head: [['Kode', 'Nama', 'Saldo']],
        body: data[tipe].map(item => [item.kode, item.nama, item.saldo]),
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      startY = doc.lastAutoTable.finalY + 10;
    });

    doc.save(`Laporan_Neraca_${bulan}_${tahun}.pdf`);
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
          <h2 className="text-xl font-bold">Laporan Neraca</h2>
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

      {data ? (
        <div className="space-y-6">
          {['aset', 'kewajiban', 'ekuitas'].map(tipe => (
            <div key={tipe}>
              <h3 className="font-semibold text-lg capitalize mb-2">{tipe}</h3>
              <table className="w-full text-sm border-separate border-spacing-y-1">
                <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
                  <tr>
                    <th className="px-3 py-1 text-left">Kode</th>
                    <th className="px-3 py-1 text-left">Nama</th>
                    <th className="px-3 py-1 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {data[tipe].map((item, i) => (
                    <tr key={i} className="bg-white shadow-sm">
                      <td className="px-3 py-1">{item.kode}</td>
                      <td className="px-3 py-1">{item.nama}</td>
                      <td className="px-3 py-1 text-right">{Number(item.saldo).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <div className="mt-4 text-sm font-medium">
            <div>Total Aset: <span className="float-right">{Number(data.total_aset).toLocaleString()}</span></div>
            <div>Total Kewajiban + Ekuitas: <span className="float-right">{Number(data.total_kewajiban_dan_ekuitas).toLocaleString()}</span></div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">Tidak ada data ditampilkan.</div>
      )}
    </div>
  );
};

export default LaporanNeraca;
