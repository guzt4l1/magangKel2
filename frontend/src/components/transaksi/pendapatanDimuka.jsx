import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/pendapatan-dimuka';
const API_AKUN = 'http://localhost:5000/api/akun';
const API_PELANGGAN = 'http://localhost:5000/api/pelanggan';

const DataPendapatanDimuka = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    tanggal: '',
    pelanggan_id: '',
    akun_kas_id: '',
    akun_pendapatan_dimuka_id: '',
    jumlah: '',
    keterangan: '',
    bukti: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [akunList, setAkunList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(API);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelasi = async () => {
    try {
      const [resAkun, resPelanggan] = await Promise.all([
        axios.get(API_AKUN),
        axios.get(API_PELANGGAN)
      ]);
      setAkunList(resAkun.data);
      setPelangganList(resPelanggan.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRelasi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      pelanggan_id: parseInt(form.pelanggan_id),
      akun_kas_id: parseInt(form.akun_kas_id),
      akun_pendapatan_dimuka_id: parseInt(form.akun_pendapatan_dimuka_id),
      jumlah: parseFloat(form.jumlah),
    };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        Swal.fire('Sukses', 'Data diperbarui', 'success');
      } else {
        await axios.post(API, payload);
        Swal.fire('Sukses', 'Data ditambahkan', 'success');
      }
      fetchData();
      closeModal();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus data ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API}/${id}`);
        Swal.fire('Dihapus', 'Data berhasil dihapus', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Gagal', 'Tidak dapat menghapus data', 'error');
      }
    }
  };

  const openEdit = (item) => {
    setForm({
      tanggal: item.tanggal,
      pelanggan_id: item.pelanggan_id?.toString() || '',
      akun_kas_id: item.akun_kas_id?.toString() || '',
      akun_pendapatan_dimuka_id: item.akun_pendapatan_dimuka_id?.toString() || '',
      jumlah: item.jumlah,
      keterangan: item.keterangan,
      bukti: item.bukti
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({
      tanggal: '',
      pelanggan_id: '',
      akun_kas_id: '',
      akun_pendapatan_dimuka_id: '',
      jumlah: '',
      keterangan: '',
      bukti: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({
      tanggal: '',
      pelanggan_id: '',
      akun_kas_id: '',
      akun_pendapatan_dimuka_id: '',
      jumlah: '',
      keterangan: '',
      bukti: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const getNama = (list, id) => {
    const item = list.find(i => i.id === id);
    return item ? `${item.kode ? item.kode + ' - ' : ''}${item.nama}` : '-';
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
          <h2 className="text-xl font-bold text-gray-800">Data Pendapatan Diterima Dimuka</h2>
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
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Pelanggan</th>
              <th className="px-4 py-2">Akun Kas</th>
              <th className="px-4 py-2">Akun Pendapatan</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2">{getNama(pelangganList, item.pelanggan_id)}</td>
                <td className="px-4 py-2">{getNama(akunList, item.akun_kas_id)}</td>
                <td className="px-4 py-2">{getNama(akunList, item.akun_pendapatan_dimuka_id)}</td>
                <td className="px-4 py-2">{item.jumlah}</td>
                <td className="px-4 py-2">{item.keterangan || '-'}</td>
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
                <td colSpan={7} className="text-center text-gray-500 py-4">
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
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Pendapatan Diterima Dimuka</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.pelanggan_id}
                onChange={(e) => setForm({ ...form, pelanggan_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Pelanggan</option>
                {pelangganList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <select
                value={form.akun_kas_id}
                onChange={(e) => setForm({ ...form, akun_kas_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Akun Kas</option>
                {akunList.map(a => (
                  <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
                ))}
              </select>
              <select
                value={form.akun_pendapatan_dimuka_id}
                onChange={(e) => setForm({ ...form, akun_pendapatan_dimuka_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Akun Pendapatan</option>
                {akunList.filter(a => a.tipe === 'pendapatan').map(a => (
                  <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                placeholder="Jumlah"
                required
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                placeholder="Keterangan"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={form.bukti}
                onChange={(e) => setForm({ ...form, bukti: e.target.value })}
                placeholder="Bukti"
                className="w-full border px-3 py-2 rounded"
              />
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

export default DataPendapatanDimuka;