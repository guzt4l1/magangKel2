import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/penghapusan-piutang';
const API_PIUTANG = 'http://localhost:5000/api/piutang';
const API_AKUN = 'http://localhost:5000/api/akun';

const DataPenghapusanPiutang = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [piutangList, setPiutangList] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({
    tanggal: '',
    piutang_id: '',
    akun_penghapusan_id: '',
    jumlah: '',
    keterangan: ''
  });
  const [editingId, setEditingId] = useState(null);
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
      const [resPiutang, resAkun] = await Promise.all([
        axios.get(API_PIUTANG),
        axios.get(API_AKUN)
      ]);
      setPiutangList(resPiutang.data);
      setAkunList(resAkun.data);
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
      piutang_id: parseInt(form.piutang_id),
      akun_penghapusan_id: parseInt(form.akun_penghapusan_id),
      jumlah: parseFloat(form.jumlah)
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
      piutang_id: item.piutang_id.toString(),
      akun_penghapusan_id: item.akun_penghapusan_id.toString(),
      jumlah: item.jumlah,
      keterangan: item.keterangan || ''
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({
      tanggal: '',
      piutang_id: '',
      akun_penghapusan_id: '',
      jumlah: '',
      keterangan: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({
      tanggal: '',
      piutang_id: '',
      akun_penghapusan_id: '',
      jumlah: '',
      keterangan: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const getNama = (list, id, isKode = false) => {
    const item = list.find(i => i.id === id);
    if (!item) return '-';
    if (isKode) return `${item.kode} - ${item.nama}`;
    return item.no_invoice || item.nama || '-';
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
          <h2 className="text-xl font-bold text-gray-800">Data Penghapusan Piutang</h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2 text-gray-700">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Piutang</th>
              <th className="px-4 py-2">Akun</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2">{getNama(piutangList, item.piutang_id)}</td>
                <td className="px-4 py-2">{getNama(akunList, item.akun_penghapusan_id, true)}</td>
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
                <td colSpan={6} className="text-center text-gray-500 py-4">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Penghapusan</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 text-gray-700">
            <div>
              <label className="text-sm font-medium">Tanggal</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Piutang</label>
              <select
                value={form.piutang_id}
                onChange={(e) => setForm({ ...form, piutang_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">Pilih Piutang</option>
                {piutangList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.no_invoice} - {parseFloat(p.total).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Akun Penghapusan</label>
              <select
                value={form.akun_penghapusan_id}
                onChange={(e) => setForm({ ...form, akun_penghapusan_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">Pilih Akun</option>
                {akunList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.kode} - {a.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Jumlah</label>
              <input
                type="number"
                step="0.01"
                value={form.jumlah}
                onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                placeholder="Jumlah"
                required
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Keterangan</label>
              <textarea
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                placeholder="Keterangan (opsional)"
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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

export default DataPenghapusanPiutang;
