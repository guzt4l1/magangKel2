import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

const API_JASA = 'http://localhost:5000/api/jasa';
const API_KATEGORI = 'http://localhost:5000/api/kategori-jasa';
const API_AKUN = 'http://localhost:5000/api/akun';

const DataJasa = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({
    nama: '', kategori_id: '', akun_penjualan_id: '', harga: '', deskripsi: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
    fetchKategori();
    fetchAkun();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(API_JASA);
    setData(res.data);
  };

  const fetchKategori = async () => {
    const res = await axios.get(API_KATEGORI);
    setKategoriList(res.data);
  };

  const fetchAkun = async () => {
    const res = await axios.get(API_AKUN);
    const akunPendapatan = res.data.filter((a) => a.tipe === 'pendapatan' && a.parent_id !== null);
    setAkunList(akunPendapatan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_JASA}/${editingId}`, form);
        Swal.fire('Sukses', 'Data berhasil diperbarui', 'success');
      } else {
        await axios.post(API_JASA, form);
        Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');
      }
      fetchData();
      setIsModalOpen(false);
      setEditingId(null);
      setForm({ nama: '', kategori_id: '', akun_penjualan_id: '', harga: '', deskripsi: '' });
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
      await axios.delete(`${API_JASA}/${id}`);
      fetchData();
      Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
    }
  };

  const openEdit = (row) => {
    setForm({
      nama: row.nama,
      kategori_id: row.kategori_id,
      akun_penjualan_id: row.akun_penjualan_id,
      harga: row.harga,
      deskripsi: row.deskripsi || '',
    });
    setEditingId(row.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({ nama: '', kategori_id: '', akun_penjualan_id: '', harga: '', deskripsi: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Data Jasa</h2>
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
              <th className="px-4 py-2">Nama Jasa</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Akun Penjualan</th>
              <th className="px-4 py-2">Harga</th>
              <th className="px-4 py-2">Deskripsi</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((jasa) => (
              <tr key={jasa.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{jasa.nama}</td>
                <td className="px-4 py-2">{jasa.KategoriJasa?.nama}</td>
                <td className="px-4 py-2">{jasa.Akun?.kode} - {jasa.Akun?.nama}</td>
                <td className="px-4 py-2 text-right">{parseFloat(jasa.harga).toLocaleString()}</td>
                <td className="px-4 py-2">{jasa.deskripsi}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => openEdit(jasa)} className="text-yellow-600 hover:text-yellow-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(jasa.id)} className="text-red-600 hover:text-red-800">
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
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Jasa</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Jasa</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    value={form.kategori_id}
                    onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoriList.map((kat) => (
                      <option key={kat.id} value={kat.id}>{kat.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Akun Penjualan</label>
                  <select
                    value={form.akun_penjualan_id}
                    onChange={(e) => setForm({ ...form, akun_penjualan_id: e.target.value })}
                    required
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Pilih Akun</option>
                    {akunList.map((akun) => (
                      <option key={akun.id} value={akun.id}>
                        {akun.kode} - {akun.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
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

export default DataJasa;
