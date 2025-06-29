// src/components/laporan/LaporanAnalisisBebanUsahaTahunan.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const API = 'http://localhost:5000/api/laporan/analisis-beban';

const LaporanAnalisisBebanUsahaTahunan = ({ onBack }) => {
  const today = new Date();
  const [tahun, setTahun] = useState(today.getFullYear());
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}?tahun=${tahun}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching analisis beban tahunan:', err);
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
          <h2 className="text-xl font-bold">Analisis Beban Usaha Tahunan</h2>
        </div>
        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="border rounded px-2 py-1 w-[100px]"
        />
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" />
            <YAxis tickFormatter={format} />
            <Tooltip formatter={(val) => `Rp ${format(val)}`} />
            <Legend />
            {Object.keys(data[0]).filter(k => k !== 'bulan').map((key, index) => (
              <Bar key={key} dataKey={key} fill={`hsl(${(index * 75) % 360}, 70%, 50%)`} name={key.replace(/_/g, ' ')} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-10">Tidak ada data untuk tahun ini.</div>
      )}
    </div>
  );
};

export default LaporanAnalisisBebanUsahaTahunan;
