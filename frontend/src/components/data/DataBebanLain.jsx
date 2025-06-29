import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/beban-lain';
const API_AKUN = 'http://localhost:5000/api/akun';

const DataBebanLain = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({ nama: '', akun_beban_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      console.error('Gagal mengambil data beban:', err);
    }
  };

  const fetchAkun = async () => {
    try {
      const res = await axios.get(API_AKUN);
      setAkunList(res.data.filter(a => a.tipe === 'beban'));
    } catch (err) {
      console.error('Gagal mengambil data akun:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAkun();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { nama: form.nama, akun_beban_id: parseInt(form.akun_beban_id) };

      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        Swal.fire('Sukses', 'Data berhasil diperbarui', 'success');
      } else {
        await axios.post(API, payload);
        Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');
      }

      fetchData();
      closeModal();
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
        fetchData();
        Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Tidak bisa menghapus data', 'error');
      }
    }
  };

  const openEdit = (item) => {
    setForm({
      nama: item.nama,
      akun_beban_id: item.akun_beban_id.toString()
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({ nama: '', akun_beban_id: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({ nama: '', akun_beban_id: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const getKodeAkun = (id) => {
    const akun = akunList.find(a => a.id === id);
    return akun ? `${akun.kode} - ${akun.nama}` : '-';
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
          <h2 className="text-xl font-bold text-gray-800">Data Beban Lain</h2>
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
              <th className="px-4 py-2">Kode Akun</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{getKodeAkun(item.akun_beban_id)}</td>
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
                <td colSpan={3} className="text-center text-gray-500 py-4">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Beban Lain</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input
                type="text"
                placeholder="Nama Beban"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.akun_beban_id}
                onChange={(e) => setForm({ ...form, akun_beban_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Kode Akun</option>
                {akunList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.kode} - {a.nama}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
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

export default DataBebanLain;
