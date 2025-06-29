//frontend/src/components/data/DataSaldoAwal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

const API_SALDO = 'http://localhost:5000/api/saldo-awal';
const API_AKUN = 'http://localhost:5000/api/akun';

const DataSaldoAwal = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({ akun_id: '', tahun: '', debit: '', kredit: '', keterangan: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAkun();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(API_SALDO);
    setData(res.data);
  };

  const fetchAkun = async () => {
    const res = await axios.get(API_AKUN);
    // Hanya ambil akun turunan (bukan header)
    const akunAnak = res.data.filter((akun) => akun.parent_id !== null);
    setAkunList(akunAnak);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_SALDO}/${editingId}`, form);
        Swal.fire('Sukses', 'Data berhasil diperbarui', 'success');
      } else {
        await axios.post(API_SALDO, form);
        Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');
      }
      fetchData();
      setIsModalOpen(false);
      setEditingId(null);
      setForm({ akun_id: '', tahun: '', debit: '', kredit: '', keterangan: '' });
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
      await axios.delete(`${API_SALDO}/${id}`);
      fetchData();
      Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
    }
  };

  const openEdit = (row) => {
    setForm({
      akun_id: row.akun_id,
      tahun: row.tahun,
      debit: row.debit,
      kredit: row.kredit,
      keterangan: row.keterangan || '',
    });
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({ akun_id: '', tahun: '', debit: '', kredit: '', keterangan: '' });
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
          <h2 className="text-xl font-bold text-gray-800">Data Saldo Awal</h2>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Tahun</th>
              <th className="px-4 py-2">Tipe</th>
              <th className="px-4 py-2">Debit</th>
              <th className="px-4 py-2">Kredit</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-x divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-2">{row.tahun}</td>
                <td className="px-4 py-2 capitalize">{row.Akun?.tipe}</td>
                <td className="px-4 py-2 text-right">{parseFloat(row.debit).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{parseFloat(row.kredit).toLocaleString()}</td>
                <td className="px-4 py-2">{row.keterangan}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => openEdit(row)} className="text-yellow-600 hover:text-yellow-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Saldo Awal</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <div>
                <label className="block mb-1 text-sm font-medium">Akun</label>
                <select
                  required
                  value={form.akun_id}
                  onChange={(e) => setForm({ ...form, akun_id: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Akun</option>
                  {akunList.map((akun) => (
                    <option key={akun.id} value={akun.id}>
                      {akun.kode} - {akun.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Tahun</label>
                  <input
                    type="number"
                    value={form.tahun}
                    onChange={(e) => setForm({ ...form, tahun: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Keterangan</label>
                  <input
                    type="text"
                    value={form.keterangan}
                    onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Debit</label>
                  <input
                    type="number"
                    value={form.debit}
                    onChange={(e) => setForm({ ...form, debit: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Kredit</label>
                  <input
                    type="number"
                    value={form.kredit}
                    onChange={(e) => setForm({ ...form, kredit: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
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

export default DataSaldoAwal;
