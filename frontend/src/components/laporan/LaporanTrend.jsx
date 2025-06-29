// src/components/laporan/LaporanTrendKeuangan.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const API = 'http://localhost:5000/api/laporan/trend';
const bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const LaporanTrendKeuangan = ({ onBack }) => {
  const today = new Date();
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching trend:', err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tahun]);

  const format = val => Number(val || 0).toLocaleString('id-ID');

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Trend Kinerja Keuangan</h2>
        </div>
        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="border rounded px-2 py-1 w-[100px]"
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bulan" tickFormatter={(val) => bulanList[val - 1]} />
          <YAxis tickFormatter={format} />
          <Tooltip formatter={(val) => `Rp ${format(val)}`} labelFormatter={(val) => bulanList[val - 1]} />
          <Legend />
          <Line type="monotone" dataKey="total_pendapatan" stroke="#1d4ed8" name="Pendapatan" strokeWidth={2} />
          <Line type="monotone" dataKey="total_beban" stroke="#dc2626" name="Beban" strokeWidth={2} />
          <Line type="monotone" dataKey="laba_bersih" stroke="#16a34a" name="Laba Bersih" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LaporanTrendKeuangan;
