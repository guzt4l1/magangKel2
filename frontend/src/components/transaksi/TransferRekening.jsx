import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/transfer-rekening';
const API_AKUN = 'http://localhost:5000/api/akun';

const TransferRekening = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [form, setForm] = useState({
    tanggal: '',
    akun_bank_sumber_id: '',
    akun_bank_tujuan_id: '',
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
      const akunRes = await axios.get(API_AKUN);
      setAkunList(akunRes.data);
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
      akun_bank_sumber_id: parseInt(form.akun_bank_sumber_id),
      akun_bank_tujuan_id: parseInt(form.akun_bank_tujuan_id),
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
      akun_bank_sumber_id: item.akun_bank_sumber_id.toString(),
      akun_bank_tujuan_id: item.akun_bank_tujuan_id.toString(),
      jumlah: item.jumlah,
      keterangan: item.keterangan || ''
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({
      tanggal: '',
      akun_bank_sumber_id: '',
      akun_bank_tujuan_id: '',
      jumlah: '',
      keterangan: ''
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({
      tanggal: '',
      akun_bank_sumber_id: '',
      akun_bank_tujuan_id: '',
      jumlah: '',
      keterangan: ''
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const getNamaAkun = (id) => {
    const item = akunList.find(i => i.id === id);
    return item ? `${item.kode} - ${item.nama}` : '-';
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
          <h2 className="text-xl font-bold text-gray-800">Data Transfer Rekening</h2>
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
              <th className="px-4 py-2">Bank Sumber</th>
              <th className="px-4 py-2">Bank Tujuan</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.tanggal}</td>
                <td className="px-4 py-2">{getNamaAkun(item.akun_bank_sumber_id)}</td>
                <td className="px-4 py-2">{getNamaAkun(item.akun_bank_tujuan_id)}</td>
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Transfer Rekening</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <select
                value={form.akun_bank_sumber_id}
                onChange={(e) => setForm({ ...form, akun_bank_sumber_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Bank Sumber</option>
                {akunList.map(a => (
                  <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
                ))}
              </select>
              <select
                value={form.akun_bank_tujuan_id}
                onChange={(e) => setForm({ ...form, akun_bank_tujuan_id: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Bank Tujuan</option>
                {akunList.map(a => (
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

export default TransferRekening;
