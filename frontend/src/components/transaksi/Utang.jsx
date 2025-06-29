// frontend/components/Utang.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowLeft, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
// import UploadBuktiInput from '../shared/UploadBuktiInput';
// import PreviewBuktiModal from '../shared/PreviewModal';

const API = 'http://localhost:5000/api/utang';
const API_PEMASOK = 'http://localhost:5000/api/pemasok';
const API_AKUN = 'http://localhost:5000/api/akun';

const Utang = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    tanggal_transaksi: '',
    pemasok_id: '',
    akun_utang_id: '',
    akun_pembelian_id: '',
    total: '',
    sisa_utang: '',
    jatuh_tempo: '',
    keterangan: '',
    bukti: null
  });
  const [editingId, setEditingId] = useState(null);
  const [pemasokList, setPemasokList] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
      const [resPemasok, resAkun] = await Promise.all([
        axios.get(API_PEMASOK),
        axios.get(API_AKUN),
      ]);
      setPemasokList(resPemasok.data);
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
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'bukti' && !(value instanceof File)) return;
      if (value !== null) payload.append(key, value);
    });

    try {
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
      Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchData();
        Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Tidak dapat menghapus data', 'error');
      }
    }
  };

  const openEdit = (item) => {
    setForm({
      tanggal_transaksi: item.tanggal_transaksi,
      pemasok_id: item.pemasok_id.toString(),
      akun_utang_id: item.akun_utang_id.toString(),
      akun_pembelian_id: item.akun_pembelian_id.toString(),
      total: item.total,
      sisa_utang: item.sisa_utang,
      jatuh_tempo: item.jatuh_tempo,
      keterangan: item.keterangan,
      bukti: item.bukti || null
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setForm({
      tanggal_transaksi: '',
      pemasok_id: '',
      akun_utang_id: '',
      akun_pembelian_id: '',
      total: '',
      sisa_utang: '',
      jatuh_tempo: '',
      keterangan: '',
      bukti: null
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({
      tanggal_transaksi: '',
      pemasok_id: '',
      akun_utang_id: '',
      akun_pembelian_id: '',
      total: '',
      sisa_utang: '',
      jatuh_tempo: '',
      keterangan: '',
      bukti: null
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handlePreview = (src) => {
    setPreviewImage(`http://localhost:5000${src}`);
  };

  const getNama = (list, id) => {
    const item = list.find(i => i.id === id);
    return item ? `${item.kode ? item.kode + ' - ' : ''}${item.nama}` : '-';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Data Utang</h2>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Pemasok</th>
              <th className="px-4 py-2">Akun Utang</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Bukti</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                <td className="px-4 py-2">{item.tanggal_transaksi}</td>
                <td className="px-4 py-2">{getNama(pemasokList, item.pemasok_id)}</td>
                <td className="px-4 py-2">{getNama(akunList, item.akun_utang_id)}</td>
                <td className="px-4 py-2">{item.total}</td>
                <td className="px-4 py-2">
                  {item.bukti && (
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handlePreview(item.bukti)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                </td>
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
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Utang</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input type="date" value={form.tanggal_transaksi} onChange={(e) => setForm({ ...form, tanggal_transaksi: e.target.value })} required className="w-full border px-3 py-2 rounded" />
              <select value={form.pemasok_id} onChange={(e) => setForm({ ...form, pemasok_id: e.target.value })} required className="w-full border px-3 py-2 rounded">
                <option value="">Pilih Pemasok</option>
                {pemasokList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <select value={form.akun_utang_id} onChange={(e) => setForm({ ...form, akun_utang_id: e.target.value })} required className="w-full border px-3 py-2 rounded">
                <option value="">Pilih Akun Utang</option>
                {akunList.filter(a => a.tipe === 'kewajiban').map(a => (
                  <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
                ))}
              </select>
              <select value={form.akun_pembelian_id} onChange={(e) => setForm({ ...form, akun_pembelian_id: e.target.value })} required className="w-full border px-3 py-2 rounded">
                <option value="">Pilih Akun Pembelian</option>
                {akunList.filter(a => ['aset', 'beban'].includes(a.tipe)).map(a => (
                  <option key={a.id} value={a.id}>{a.kode} - {a.nama}</option>
                ))}
              </select>
              <input type="number" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} placeholder="Total" required className="w-full border px-3 py-2 rounded" />
              <input type="number" step="0.01" value={form.sisa_utang} onChange={(e) => setForm({ ...form, sisa_utang: e.target.value })} placeholder="Sisa Utang" required className="w-full border px-3 py-2 rounded" />
              <input type="date" value={form.jatuh_tempo} onChange={(e) => setForm({ ...form, jatuh_tempo: e.target.value })} required className="w-full border px-3 py-2 rounded" />
              <textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Keterangan" className="w-full border px-3 py-2 rounded" />
              {/* <UploadBuktiInput form={form} setForm={setForm} /> */}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* <PreviewBuktiModal previewImage={previewImage} setPreviewImage={setPreviewImage} /> */}
    </div>
  );
};

export default Utang;
