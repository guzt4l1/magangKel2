// src/components/data/DataBankPemberiPinjaman.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/bank-pemberi-pinjaman';

const DataBankPemberiPinjaman = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ pemberi_id: '', bank_id: '', no_rekening: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [pemberis, setPemberis] = useState([]);

  const fetchData = async () => {
    try {
      const [resData, resBank, resPemberi] = await Promise.all([
        axios.get(API),
        axios.get('http://localhost:5000/api/bank'),
        axios.get('http://localhost:5000/api/pemberi-pinjaman'),
      ]);
      setData(resData.data);
      setBanks(resBank.data);
      setPemberis(resPemberi.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal mengambil data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, form);
        Swal.fire('Sukses', 'Data berhasil diperbarui', 'success');
      } else {
        await axios.post(API, form);
        Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');
      }
      fetchData();
      setIsModalOpen(false);
      setForm({ pemberi_id: '', bank_id: '', no_rekening: '' });
      setEditingId(null);
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API}/${id}`);
        Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Gagal', 'Tidak bisa menghapus data', 'error');
      }
    }
  };

  const openEdit = (item) => {
    setForm({
      pemberi_id: item.pemberi_id,
      bank_id: item.bank_id,
      no_rekening: item.no_rekening || '',
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({ pemberi_id: '', bank_id: '', no_rekening: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Bank Pemberi Pinjaman</h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Pemberi</th>
              <th className="px-4 py-2">Bank</th>
              <th className="px-4 py-2">No Rekening</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.PemberiPinjaman?.nama || '-'}</td>
                <td className="px-4 py-2">{item.Bank?.nama_bank || '-'}</td>
                <td className="px-4 py-2">{item.no_rekening}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-yellow-600 hover:text-yellow-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Bank Pemberi Pinjaman</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <select
                value={form.pemberi_id}
                onChange={(e) => setForm({ ...form, pemberi_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Pemberi Pinjaman</option>
                {pemberis.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <select
                value={form.bank_id}
                onChange={(e) => setForm({ ...form, bank_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Bank</option>
                {banks.map(b => (
                  <option key={b.id} value={b.id}>{b.nama_bank}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="No Rekening"
                value={form.no_rekening}
                onChange={(e) => setForm({ ...form, no_rekening: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataBankPemberiPinjaman;
