// src/components/data/DataAset.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const API = '/api/aset';

const DataAset = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nama: '',
    jenis: '',
    nilai_perolehan: '',
    tanggal_perolehan: '',
    umur_ekonomis: '',
    keterangan: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      console.error('Gagal mengambil data:', err);
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
      setEditingId(null);
      setForm({ nama: '', jenis: '', nilai_perolehan: '', tanggal_perolehan: '', umur_ekonomis: '', keterangan: '' });
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
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchData();
        Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Tidak bisa menghapus data', 'error');
      }
    }
  };

  const openEdit = (item) => {
    setForm({
      nama: item.nama || '',
      jenis: item.jenis || '',
      nilai_perolehan: item.nilai_perolehan || '',
      tanggal_perolehan: item.tanggal_perolehan ? item.tanggal_perolehan.split('T')[0] : '',
      umur_ekonomis: item.umur_ekonomis || '',
      keterangan: item.keterangan || ''
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({ nama: '', jenis: '', nilai_perolehan: '', tanggal_perolehan: '', umur_ekonomis: '', keterangan: '' });
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
          <h2 className="text-xl font-bold text-gray-800">Data Aset</h2>
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
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Jenis</th>
              <th className="px-4 py-2 text-right">Nilai</th>
              <th className="px-4 py-2">Tgl Perolehan</th>
              <th className="px-4 py-2">Umur Ekonomis</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.jenis}</td>
                <td className="px-4 py-2 text-right">{parseFloat(item.nilai_perolehan).toLocaleString()}</td>
                <td className="px-4 py-2">{item.tanggal_perolehan?.split('T')[0]}</td>
                <td className="px-4 py-2">{item.umur_ekonomis} th</td>
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
                <td colSpan={6} className="text-center text-gray-500 py-4">
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
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Aset</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input
                type="text"
                placeholder="Nama Aset"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Jenis Aset"
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Nilai Perolehan"
                value={form.nilai_perolehan}
                onChange={(e) => setForm({ ...form, nilai_perolehan: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded text-right"
              />
              <input
                type="date"
                placeholder="Tanggal Perolehan"
                value={form.tanggal_perolehan}
                onChange={(e) => setForm({ ...form, tanggal_perolehan: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Umur Ekonomis (tahun)"
                value={form.umur_ekonomis}
                onChange={(e) => setForm({ ...form, umur_ekonomis: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Keterangan"
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
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

export default DataAset;
