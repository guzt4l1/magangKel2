import React, { useState } from "react";
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

import LaporanNeraca from "../components/laporan/LaporanNeraca";
import LaporanLabaRugi from "../components/laporan/LaporanLabaRugi";
import LaporanRincian from "../components/laporan/LaporanRincian";
import LaporanArusKas from "../components/laporan/LaporanArusKas";
import LaporanHistoriTansaksi from "../components/laporan/LaporanHistoriTansaksi";
import LaporanKinerjaKeuangan from "../components/laporan/LaporanKinerjaKeuangan";
import LaporanTrend from "../components/laporan/LaporanTrend";
import LaporanAnalisisBebanUsahaTahunan from "../components/laporan/LaporanAnalisisBeban";

const Laporan = () => {
  const [fiturAktif, setFiturAktif] = useState(null);

  const laporanList = [
    {
      id: "neraca",
      title: "Laporan Posisi Keuangan (Neraca)",
      desc: "Menu untuk melihat laporan Neraca",
      icon: <FaBalanceScale size={24} />,
      onClick: () => setFiturAktif("neraca"),
    },
    {
      id: "rincian",
      title: "Laporan Rincian",
      desc: "Rincian pos keuangan",
      icon: <FaList size={24} />,
      onClick: () => setFiturAktif("rincian"),
    },
    {
      id: "labaRugi",
      title: "Laporan Laba Rugi & Saldo Laba",
      desc: "Menu untuk melihat laporan Laba Rugi dan Saldo Laba",
      icon: <FaChartLine size={24} />,
      onClick: () => setFiturAktif("labaRugi"),
    },
    {
      id: "arusKas",
      title: "Laporan Arus Kas",
      desc: "Menu untuk melihat laporan Arus Kas",
      icon: <FaMoneyBillWave size={24} />,
      onClick: () => setFiturAktif("arusKas"),
    },
    {
      id: "history",
      title: "Laporan History Transaksi",
      desc: "Berisi List History Transaksi",
      icon: <FaHistory size={24} />,
      onClick: () => setFiturAktif("history"),
    },
    {
      id: "kinerja",
      title: "Laporan Kinerja Keuangan",
      desc: "Rincian Kinerja keuangan",
      icon: <FaChartBar size={24} />,
      onClick: () => setFiturAktif("kinerja"),
    },
    {
      id: "trend",
      title: "Laporan Trend",
      desc: "",
      icon: <FaChartArea size={24} />,
      onClick: () => setFiturAktif("trend"),
    },
    {
      id: "analisisBeban",
      title: "Laporan Analisis Beban Usaha Tahunan",
      desc: "Struktur Beban (Cost Structure)",
      icon: <FaChartPie size={24} />,
      onClick: () => setFiturAktif("analisisBeban"),
    },
  ];

  const renderKomponenAktif = () => {
    switch (fiturAktif) {
      case "neraca":
        return <LaporanNeraca onBack={() => setFiturAktif(null)} />;
      case "labaRugi":
        return <LaporanLabaRugi onBack={() => setFiturAktif(null)} />;
      case "rincian":
        return <LaporanRincian onBack={() => setFiturAktif(null)} />;
      case "arusKas":
        return <LaporanArusKas onBack={() => setFiturAktif(null)} />;
      case "history":
        return <LaporanHistoriTansaksi onBack={() => setFiturAktif(null)} />;
      case "kinerja":
        return <LaporanKinerjaKeuangan onBack={() => setFiturAktif(null)} />;
      case "trend":
        return <LaporanTrend onBack={() => setFiturAktif(null)} />;
      case "analisisBeban":
        return <LaporanAnalisisBebanUsahaTahunan onBack={() => setFiturAktif(null)} />;
      default:
        return null;
    }
  };

  if (fiturAktif) {
    return <div className="p-4">{renderKomponenAktif()}</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-2">LAPORAN</h2>
      <div className="p-6 mt-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg">
        {laporanList.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className="relative cursor-pointer bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-md shadow hover:shadow-lg transition text-left min-h-[100px]"
          >
            <div className="absolute top-3 right-3 text-gray-300">{item.icon}</div>
            <h3 className="text-sm font-semibold mb-1 mr-6 leading-snug">{item.title}</h3>
            <p className="text-xs text-yellow-300">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Laporan;
