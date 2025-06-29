import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { formatTanggal } from '../utils/formatTanggal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = useState(currentYear);
  const [activeTab, setActiveTab] = useState('jasa');
  const [penjualanData, setPenjualanData] = useState([]);
  const [dataJasa, setDataJasa] = useState([]);
  const [dataUtang, setDataUtang] = useState([]);
  const [dataPiutang, setDataPiutang] = useState([]);
  const [bebanUsaha, setBebanUsaha] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/beranda?tahun=${tahun}`);
        console.log("DATA DITERIMA:", res.data); 
        const { penjualan, jasa, utang, piutang, beban_usaha } = res.data;
        setPenjualanData(penjualan || []);
        setDataJasa(jasa || []);
        setDataUtang(utang || []);
        setDataPiutang(piutang || []);
        setBebanUsaha(beban_usaha || []);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [tahun]);

  const handleTahunChange = (e) => {
    const input = e.target.value;
    if (!isNaN(input) && Number(input) <= currentYear) {
      setTahun(Number(input));
    }
  };

  // ===== Area Chart Config =====
  const areaChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Penjualan',
        data: penjualanData.length ? penjualanData : Array(12).fill(0),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
    ],
  };

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // ===== Pie Chart Config =====
  const pieChartData = {
      labels: Array.isArray(bebanUsaha) ? bebanUsaha.map(item => item.kategori) : [],
      datasets: [{
        data: Array.isArray(bebanUsaha) ? bebanUsaha.map(item => item.jumlah || item.total) : [],
        backgroundColor: bebanUsaha.map((_, i) =>
          `hsl(${(i * 360) / bebanUsaha.length}, 70%, 60%)`
        ),
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: { legend: { display: false } },
  };

  // ===== Table Render Function =====
  const renderTable = () => {
    let rows = [];
    let headers = [];
    let total = 0;

    if (activeTab === 'jasa') {
      headers = ['ID', 'Nama Jasa', 'Harga', 'Tanggal'];
     rows = dataJasa.map((item) => {
        return [
          item.id,
          item.nama,
          `Rp${item.harga.toLocaleString()}`,
          formatTanggal(item.created_at)
        ];
      });
      total = dataJasa.reduce((sum, item) => sum + item.harga, 0);
    } else if (activeTab === 'utang') {
        headers = ['ID', 'Keterangan', 'Jumlah', 'Jatuh Tempo'];
        rows = dataUtang.map((item) => [
          item.id,
          item.keterangan,
          `Rp${item.jumlah.toLocaleString()}`,
          item.jatuh_tempo
        ]);
        total = dataUtang.reduce((sum, item) => sum + item.jumlah, 0);
    } else if (activeTab === 'piutang') {
      headers = ['ID', 'Nama Pelanggan', 'Jumlah', 'Tanggal Transaksi'];
      rows = dataPiutang.map((item) => [
        item.id, item.nama_pelanggan, `Rp${item.jumlah.toLocaleString()}`, item.tanggal_transaksi
      ]);
      total = dataPiutang.reduce((sum, item) => sum + item.jumlah, 0);
    }

    return (
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Tabel {activeTab.toUpperCase()}</h2>
        <table className="w-full table-auto border-collapse text-sm mb-2">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="p-3 border-b border-gray-300 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {row.map((cell, i) => (
                  <td key={i} className="p-3 border-b border-gray-200">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-medium text-gray-800">Total: Rp{total.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white-800 mb-6">BERANDA</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-white rounded-2xl p-6 text-gray-800">
        {/* Area Chart */}
        <div className="md:col-span-2 bg-gray-100 rounded-xl shadow-md p-6 font-semibold">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
            <h3 className="text-lg md:text-2xl font-bold text-gray-700 tracking-wide uppercase text-center md:text-left">
              INFORMASI PENJUALAN
            </h3>
            <div className="flex items-center">
              <label htmlFor="tahunInput" className="mr-2 text-sm">Periode:</label>
              <input
                id="tahunInput"
                type="number"
                value={tahun}
                onChange={handleTahunChange}
                className="p-1 border rounded text-sm"
                min="2000"
                max={currentYear}
                placeholder="Masukkan tahun"
              />
            </div>
          </div>
          <div className="w-full h-60">
            <Line data={areaChartData} options={areaOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-100 rounded-xl shadow-md flex flex-col items-center justify-center font-semibold p-6">
          <h3 className="text-2xl font-bold text-gray-700 mb-4 tracking-wide uppercase">
            BEBAN USAHA
          </h3>
          <div className="w-60 h-60">
            {bebanUsaha.length ? (
              <Doughnut data={pieChartData} options={pieOptions} />
            ) : (
              <p className="text-center text-gray-500">Memuat data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow text-gray-800">
        <div className="flex space-x-4 mb-6">
          {['jasa', 'utang', 'piutang'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gray-800 text-white shadow'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">{renderTable()}</div>
      </div>
    </div>
  );
};

export default Dashboard;