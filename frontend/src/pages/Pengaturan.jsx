import React, { useState } from 'react';
import {
  Upload,
  Download,
  Users,
  Info,
  Building,
} from 'lucide-react';

import DaftarUser from '../components/Pengaturan/DaftarUser'; // pastikan ini ada

const Pengaturan = () => {
  const [fiturAktif, setFiturAktif] = useState(null); // null = default menu

  const settings = [
    { title: "Backup", icon: <Upload className="w-10 h-10 text-blue-200" /> },
    { title: "Restore", icon: <Download className="w-10 h-10 text-blue-200" /> },
    {
      title: "Daftar User",
      icon: <Users className="w-10 h-10 text-blue-200" />,
      onClick: () => setFiturAktif('daftarUser'),
    },
    { title: "Info Aplikasi", icon: <Info className="w-10 h-10 text-blue-200" /> },
    { title: "Info Perusahaan", icon: <Building className="w-10 h-10 text-blue-200" /> },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <h1 className="text-2xl font-semibold text-white">PENGATURAN</h1>

      {/* Tampilan Menu Utama */}
      {fiturAktif === null && (
        <div className="p-6 mt-6 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 rounded-xl">
          {settings.map((setting, index) => (
            <div
              key={index}
              onClick={setting.onClick || (() => {})} // jika ada aksi, jalankan
              className="flex items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300 min-h-[130px] cursor-pointer"
            >
              <div className="mr-4">
                {setting.icon}
              </div>
              <h3 className="text-base font-semibold">{setting.title}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Tampilan Fitur Daftar User */}
      {fiturAktif === 'daftarUser' && (
        <div className="p-6">
          <DaftarUser onBack={() => setFiturAktif(null)} />
        </div>
      )}
    </div>
  );
};

export default Pengaturan;
