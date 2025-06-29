import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FaUserCircle, FaHome, FaSignOutAlt, FaBars,
  FaDatabase, FaExchangeAlt, FaFileAlt, FaCog,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate(); 
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar Aplikasi?',
      text: 'Anda yakin ingin logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded transition-colors ${
      isActive ? 'bg-gray-700 text-white' : 'hover:text-gray-300'
    }`;

  return (
    <>
      {/* Header Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white fixed w-full z-50">
        <div className="text-2xl font-bold">FinanceApp</div>
        <button onClick={toggleSidebar} className="text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex pt-16 md:pt-0`}
      >
        {/* Sidebar Title Desktop */}
        <div className="hidden md:flex justify-between items-center p-6 border-b border-gray-700">
          <span className="text-2xl font-bold">FinanceApp</span>
          {user.foto ? (
            <img
              src={
                user.foto?.startsWith('/uploads')
                  ? `http://localhost:5000${user.foto}`
                  : `http://localhost:5000/uploads/${user.foto}`
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
          ) : (
            <FaUserCircle className="text-3xl" />
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink to="/Dashboard" end className={linkClasses}>
                <FaHome /> Beranda
              </NavLink>
            </li>
            <li>
              <NavLink to="/Data" className={linkClasses}>
                <FaDatabase /> Data
              </NavLink>
            </li>
            <li>
              <NavLink to="/Transaksi" className={linkClasses}>
                <FaExchangeAlt /> Transaksi
              </NavLink>
            </li>
            <li>
              <NavLink to="/Laporan" className={linkClasses}>
                <FaFileAlt /> Laporan
              </NavLink>
            </li>
            <li>
              <NavLink to="/Pengaturan" className={linkClasses}>
                <FaCog /> Pengaturan
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:text-red-400"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
