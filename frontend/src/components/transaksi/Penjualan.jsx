import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, ArrowLeft, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

const API = 'http://localhost:5000/api/penjualan';
const API_PELANGGAN = 'http://localhost:5000/api/pelanggan';
const API_AKUN = 'http://localhost:5000/api/akun';
const API_JASA = 'http://localhost:5000/api/jasa';

const DataPenjualan = ({ onBack }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    jenis_transaksi: 'penjualan_jasa',
    metode_pembayaran: 'tunai',
    tanggal: '',
    pelanggan_id: '',
    jasa_id: '',
    jumlah: 1,
    akun_piutang_id: '',
    akun_penjualan_id: '',
    harga: 0,
    total: 0,
    uang_muka: '',
    jatuh_tempo: '',
    keterangan: '',
    bukti: null
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [pelangganList, setPelangganList] = useState([]);
  const [akunList, setAkunList] = useState([]);
  const [jasaList, setJasaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
  try {
    const res = await axios.get(`${API}?jenis_transaksi=${form.jenis_transaksi}`);
    setData(res.data);
  } catch (err) {
    console.error('Gagal mengambil data:', err);
  }
};

  const fetchRelasi = async () => {
    try {
      const [resPelanggan, resAkun, resJasa] = await Promise.all([
        axios.get(API_PELANGGAN),
        axios.get(API_AKUN),
        axios.get(API_JASA)
      ]);
      setPelangganList(resPelanggan.data);
      setAkunList(resAkun.data);
      setJasaList(resJasa.data);
    } catch (err) {
      console.error('Gagal mengambil data relasi:', err);
    }
  };

useEffect(() => {
  fetchData();
  console.log("Data jasaList:", jasaList);
}, [form.jenis_transaksi]);


  useEffect(() => {
    const jasa = jasaList.find(j => j.id === parseInt(form.jasa_id));
    if (jasa) {
      setForm(prev => ({
        ...prev,
        akun_penjualan_id: jasa.akun_penjualan_id?.toString() || '',
        harga: jasa.harga,
        total: jasa.harga * (prev.jumlah || 1)
      }));
    }
  }, [form.jasa_id, form.jumlah, jasaList]);
  useEffect(() => {
  if (form.metode_pembayaran === 'kredit') {
    const akunPiutangDefault = akunList.find(a => a.nama.toLowerCase().includes('piutang'));
    if (akunPiutangDefault) {
      setForm(prev => ({
        ...prev,
        akun_piutang_id: akunPiutangDefault.id.toString()
      }));
    }
  } else {
    setForm(prev => ({
      ...prev,
      akun_piutang_id: '' // kosongkan jika tunai
    }));
  }
}, [form.metode_pembayaran, akunList]);
useEffect(() => {
  fetchRelasi(); // ← INI YANG BELUM ADA
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value);
    });
    if (form.bukti) formData.append('bukti', form.bukti);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
        Swal.fire('Sukses', 'Data berhasil diperbarui', 'success');
      } else {
        await axios.post(API, formData);
        Swal.fire('Sukses', 'Data berhasil ditambahkan', 'success');
      }
      fetchData();
      closeModal();
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan data', 'error');
    }
    console.log("Harga terkirim:", form.harga);
console.log("Total terkirim:", form.total);
  };

const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Data?',
    text: 'Data akan dihapus secara permanen',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  });

  if (confirm.isConfirmed) {
    try {
      const res = await axios.delete(`${API}/${id}`);

      if (res.status === 200 || res.status === 204) {
        // update data lokal tanpa reload
        setData(prev => prev.filter(item => item.id !== id));
        Swal.fire('Terhapus', 'Data berhasil dihapus', 'success');
      } else {
        throw new Error('Tidak berhasil menghapus');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal menghapus data', 'error');
    }
  }
};


  const openAdd = () => {
    setForm({
      jenis_transaksi: 'penjualan_jasa',
      metode_pembayaran: 'tunai',
      tanggal: '',
      pelanggan_id: '',
      jasa_id: '',
      jumlah: 1,
      akun_piutang_id: '',
      akun_penjualan_id: '',
      harga: 0,
      total: 0,
      uang_muka: '',
      jatuh_tempo: '',
      keterangan: '',
      bukti: null
    });
    setPreview(null);
    setEditingId(null);
    setIsModalOpen(true);
  };
  const openEdit = (item) => {
  setForm({
    ...item,
    jasa_id: item.jasa_id?.toString() || '',
    akun_piutang_id: item.akun_piutang_id?.toString() || '',
    akun_penjualan_id: item.akun_penjualan_id?.toString() || '',
    pelanggan_id: item.pelanggan_id?.toString() || '',
    jumlah: item.jumlah || 1,
    bukti: null, // kosongkan untuk upload baru
  });
  setPreview(item.bukti ? `http://localhost:5000${item.bukti}` : null);
  setEditingId(item.id);
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, bukti: file });
      setPreview(URL.createObjectURL(file));
    }
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
          <h2 className="text-xl font-bold text-gray-800">Data Penjualan</h2>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      <div className="flex gap-2 mb-4">
  {['penjualan_jasa', 'pembayaran_piutang', 'penjualan_aset'].map(jenis => (
    <button
      key={jenis}
      onClick={() => setForm({ ...form, jenis_transaksi: jenis })}
      className={`px-4 py-2 rounded ${
        form.jenis_transaksi === jenis ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {jenis.replace('_', ' ').toUpperCase()}
    </button>
  ))}
</div>

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Pelanggan</th>

              {form.jenis_transaksi === 'penjualan_jasa' && (
                <th className="px-4 py-2">Jasa</th>
              )}

              {form.jenis_transaksi === 'penjualan_aset' && (
                <th className="px-4 py-2">Akun Aset</th>
              )}

              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2 text-center">Bukti</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (           
              <tr key={item.id} className="bg-white border shadow-sm rounded">
                {/* Tanggal Transaksi */}
                <td className="px-4 py-2">{item.tanggal || item.tanggal_transaksi}</td>

                {/* Nama Pelanggan */}
                <td className="px-4 py-2">{item.Pelanggan?.nama || '-'}</td>

                {/* JENIS TRANSAKSI KHUSUS */}
                {form.jenis_transaksi === 'penjualan_jasa' && (
                  <td className="px-4 py-2">{item.Jasa?.nama || '-'}</td>
                )}

                {form.jenis_transaksi === 'penjualan_aset' && (
                  <td className="px-4 py-2">{item.aset?.nama || '-'}</td>
                )}


                {/* Total atau Sisa Tagihan */}
                <td className="px-4 py-2">
                  Rp{' '}
                  {form.jenis_transaksi === 'pembayaran_piutang'
                    ? parseFloat(item.sisa_tagihan || 0).toLocaleString()
                    : parseFloat(item.total || 0).toLocaleString()}
                </td>

                {/* Bukti Upload */}
                <td className="px-4 py-2 text-center">
                  {item.bukti ? (
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: 'Bukti Penjualan',
                          html: `<img src="http://localhost:5000${item.bukti}" alt="Bukti" style="max-width:100%; max-height:400px;" />`,
                          showCloseButton: true,
                          showConfirmButton: false,
                          width: 600,
                        })
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5 inline" />
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Aksi Edit & Hapus */}
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 text-gray-800">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              {editingId ? 'Edit Penjualan' : 'Tambah Penjualan'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={form.pelanggan_id}
                  onChange={(e) => setForm({ ...form, pelanggan_id: e.target.value })}
                  required
                  className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Pelanggan</option>
                  {pelangganList.map(p => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>

                <select
                  value={form.jenis_transaksi}
                  onChange={(e) => setForm({ ...form, jenis_transaksi: e.target.value })}
                  className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                >
                  <option value="penjualan_jasa">Penjualan Jasa</option>
                  <option value="pembayaran_piutang">Pembayaran Piutang</option>
                  <option value="penjualan_aset">Penjualan Aset</option>
                </select>

                {form.jenis_transaksi !== 'pembayaran_piutang' && (
                  <select
                    value={form.metode_pembayaran}
                    onChange={(e) => setForm({ ...form, metode_pembayaran: e.target.value })}
                    className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="tunai">Tunai</option>
                    <option value="kredit">Kredit</option>
                  </select>
                )}

                {/* Penjualan Jasa */}
                {form.jenis_transaksi === 'penjualan_jasa' && (
                  <>
                    <select
                      value={form.jasa_id}
                      onChange={(e) => setForm({ ...form, jasa_id: e.target.value })}
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Jasa</option>
                      {jasaList.map(j => (
                        <option key={j.id} value={j.id}>{j.nama}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={form.jumlah}
                      onChange={(e) => setForm({ ...form, jumlah: parseInt(e.target.value) || 1 })}
                      placeholder="Jumlah"
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="number"
                      value={form.harga}
                      readOnly
                      className="border border-gray-300 bg-gray-100 px-3 py-2 rounded w-full"
                    />
                    <input
                      type="number"
                      value={form.total}
                      readOnly
                      className="border border-gray-300 bg-gray-100 px-3 py-2 rounded w-full"
                    />
                  </>
                )}

                {/* Pembayaran Piutang */}
                {form.jenis_transaksi === 'pembayaran_piutang' && (
                  <input
                    type="number"
                    placeholder="Jumlah Pembayaran"
                    value={form.total}
                    onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })}
                    className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Penjualan Aset */}
                {form.jenis_transaksi === 'penjualan_aset' && (
                  <>
                    <select
                      value={form.akun_penjualan_id}
                      onChange={(e) => setForm({ ...form, akun_penjualan_id: e.target.value })}
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Akun Penjualan Aset</option>
                      {akunList
                        .filter(a => a.nama.toLowerCase().includes('aset'))
                        .map(a => (
                          <option key={a.id} value={a.id}>
                            {a.kode} - {a.nama}
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Total Penjualan Aset"
                      value={form.total}
                      onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })}
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}

                {/* Kredit */}
                {form.metode_pembayaran === 'kredit' && form.jenis_transaksi !== 'pembayaran_piutang' && (
                  <>
                    <input
                      type="number"
                      placeholder="Uang Muka"
                      value={form.uang_muka}
                      onChange={(e) => setForm({ ...form, uang_muka: e.target.value })}
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      placeholder="Jatuh Tempo"
                      value={form.jatuh_tempo}
                      onChange={(e) => setForm({ ...form, jatuh_tempo: e.target.value })}
                      className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                )}
              </div>

              <textarea
                placeholder="Keterangan"
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                className="border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              />

              {preview && (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover border rounded mx-auto" />
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
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

export default DataPenjualan;
