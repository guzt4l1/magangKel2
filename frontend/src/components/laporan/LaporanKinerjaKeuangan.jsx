// src/components/laporan/LaporanKinerjaKeuangan.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Info, BarChart4, Table } from 'lucide-react';

const API = 'http://localhost:5000/api/laporan/kinerja-keuangan';
const bulanList = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const LaporanKinerjaKeuangan = ({ onBack }) => {
  const today = new Date();
  const [bulan, setBulan] = useState(today.getMonth() + 1);
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState(null);
  const [viewMode, setViewMode] = useState('rasio');
  const [dataPerbandingan, setDataPerbandingan] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?bulan=${bulan}&tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching kinerja keuangan:', err);
      setData(null);
    }
  };

  const fetchPerbandingan = async () => {
    try {
      const res = await axios.get(`${API}/perbandingan?tahun=${tahun}`);
      setDataPerbandingan(res.data);
    } catch (err) {
      console.error(err);
      setDataPerbandingan([]);
    }
  };

  useEffect(() => {
    fetchData();
    if (viewMode === 'perbandingan') fetchPerbandingan();
  }, [bulan, tahun, viewMode]);

  const format = (val) => Number(val || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Laporan Kinerja Keuangan</h2>
        </div>
        <div className="flex gap-2 items-center">
          <select value={bulan} onChange={e => setBulan(Number(e.target.value))} className="border rounded px-2 py-1">
            {bulanList.map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
          </select>
          <input type="number" value={tahun} onChange={e => setTahun(Number(e.target.value))} className="border rounded px-2 py-1 w-[100px]" />
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setViewMode('rasio')} className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${viewMode === 'rasio' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
          <BarChart4 className="w-4 h-4" /> Rasio
        </button>
        <button onClick={() => setViewMode('perbandingan')} className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${viewMode === 'perbandingan' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
          <Table className="w-4 h-4" /> Perbandingan
        </button>
      </div>

      {data && viewMode === 'rasio' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-800">Analisis Rasio Keuangan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded shadow">
                <div className="text-xs text-blue-700">Profit Margin</div>
                <div className="text-xl font-bold">{format(data.rasio.profitMargin)}%</div>
                <div className="text-xs text-gray-600">Laba bersih dibanding total pendapatan</div>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow">
                <div className="text-xs text-yellow-700">Operating Ratio</div>
                <div className="text-xl font-bold">{format(data.rasio.operatingRatio)}%</div>
                <div className="text-xs text-gray-600">Efisiensi operasional usaha</div>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <div className="text-xs text-gray-700">Return on Assets (ROA)</div>
                <div className="text-xl font-bold">{format(data.rasio.returnOnAssets)}%</div>
                <div className="text-xs text-gray-600">Mengukur laba atas total aset</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-2 text-blue-800">Ringkasan Keuangan</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Total Penjualan</div>
              <div className="text-right font-medium">Rp {format(data.total_penjualan)}</div>
              <div>Total Pendapatan Lain</div>
              <div className="text-right font-medium">Rp {format(data.total_pendapatan_lain)}</div>
              <div>Total Pendapatan</div>
              <div className="text-right font-bold text-blue-900">Rp {format(data.total_pendapatan)}</div>
              <div>Total Beban</div>
              <div className="text-right font-bold text-red-800">Rp {format(data.total_beban)}</div>
              <div>Laba Bersih</div>
              <div className="text-right font-bold text-green-700">Rp {format(data.laba_bersih)}</div>
              <div>Total Aset</div>
              <div className="text-right font-bold text-blue-700">Rp {format(data.total_aset)}</div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'perbandingan' && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Perbandingan Bulanan - {tahun}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-3 py-2 border">Bulan</th>
                  <th className="px-3 py-2 border">Pendapatan</th>
                  <th className="px-3 py-2 border">Beban</th>
                  <th className="px-3 py-2 border">Laba Bersih</th>
                </tr>
              </thead>
              <tbody>
                {dataPerbandingan.map((row, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-100">
                    <td className="px-3 py-2 border">{bulanList[row.bulan - 1]}</td>
                    <td className="px-3 py-2 border text-right">Rp {format(row.total_pendapatan)}</td>
                    <td className="px-3 py-2 border text-right">Rp {format(row.total_beban)}</td>
                    <td className="px-3 py-2 border text-right">Rp {format(row.laba_bersih)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaporanKinerjaKeuangan;
// This component displays financial performance reports with options to view ratios or monthly comparisons.