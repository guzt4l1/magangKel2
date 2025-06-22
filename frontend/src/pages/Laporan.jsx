import React from "react";
import {
  FaBalanceScale,
  FaList,
  FaChartLine,
  FaMoneyBillWave,
  FaHistory,
  FaChartBar,
  FaChartArea,
  FaChartPie,
} from "react-icons/fa";

const laporanCards = [
  {
    title: "Laporan Posisi Keuangan (Neraca)",
    desc: "Menu untuk melihat laporan Neraca",
    icon: <FaBalanceScale size={24} />,
  },
  {
    title: "Laporan Rincian",
    desc: "Rincian pos keuangan",
    icon: <FaList size={24} />,
  },
  {
    title: "Laporan Laba Rugi & Saldo Laba",
    desc: "Menu untuk melihat laporan Laba Rugi dan Saldo Laba",
    icon: <FaChartLine size={24} />,
  },
  {
    title: "Laporan Arus Kas",
    desc: "Menu untuk melihat laporan Arus Kas",
    icon: <FaMoneyBillWave size={24} />,
  },
  {
    title: "Laporan History Transaksi",
    desc: "Berisi List History Transaksi",
    icon: <FaHistory size={24} />,
  },
  {
    title: "Laporan Kinerja Keuangan",
    desc: "Rincian Kinerja keuangan",
    icon: <FaChartBar size={24} />,
  },
  {
    title: "Laporan Trend",
    desc: "",
    icon: <FaChartArea size={24} />,
  },
  {
    title: "Laporan Analisis Beban Usaha Tahunan",
    desc: "Struktur Beban (Cost Structure)",
    icon: <FaChartPie size={24} />,
  },
];

const Laporan = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header biasanya di atas, dipisah */}
      <div>
        <h2 className="text-2xl font-semibold text-white">LAPORAN</h2>
      </div>

      {/* Grid Cards */}
      <div className="p-6 mt-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg">
        {laporanCards.map((card, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition min-h-[100px]"
          >
            {/* Icon kanan atas */}
            <div className="absolute top-3 right-3 text-gray-300">
              {card.icon}
            </div>
            {/* Judul */}
            <h3 className="text-sm font-semibold mb-1 mr-3 leading-snug">
              {card.title}
            </h3>
            {/* Deskripsi */}
            {card.desc && (
              <p className="text-xs text-yellow-300">{card.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Laporan;
