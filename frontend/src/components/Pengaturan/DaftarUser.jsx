// src/components/data/DaftarUser.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

const DaftarUser = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nama: '', email: '', password: '', role: 'staff', status: 'aktif', foto: null });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = 'http://localhost:5000/api/users';
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setUsers(res.data);
    } catch (err) {
      Swal.fire('Gagal memuat data', '', 'error');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, foto: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('email', form.email);
    if (form.password) formData.append('password', form.password);
    formData.append('role', form.role);
    formData.append('status', form.status);
    if (form.foto) formData.append('foto', form.foto);

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Berhasil diupdate!', '', 'success');
      } else {
        await axios.post(API, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Berhasil ditambahkan!', '', 'success');
      }

      setForm({ nama: '', email: '', password: '', role: 'staff', status: 'aktif', foto: null });
      setEditingId(null);
      setPreviewFoto(null);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      Swal.fire('Gagal menyimpan user', err.response?.data?.message || '', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'User yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire('Berhasil dihapus!', '', 'success');
      fetchUsers();
    } catch (err) {
      Swal.fire('Gagal menghapus user', '', 'error');
    }
  };

  const canEditUser = (targetUser) => {
    if (currentUser.role === 'owner') return true;
    if (currentUser.role === 'admin') {
      if (targetUser.id === currentUser.id) return true;
      if (targetUser.role === 'owner' || targetUser.role === 'admin') return false;
      return true;
    }
    if (currentUser.role === 'staff') {
      return targetUser.id === currentUser.id;
    }
    return false;
  };

  const canDeleteUser = (targetUser) => {
    if (currentUser.role === 'owner') return true;
    if (currentUser.role === 'admin') return targetUser.role !== 'owner' && targetUser.id !== currentUser.id;
    return false;
  };

  const handleEdit = (user) => {
    setForm({ nama: user.nama, email: user.email, password: '', role: user.role, status: user.status, foto: null });
    setPreviewFoto(`http://localhost:5000${user.foto}`);
    setEditingId(user.id);
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
          <h2 className="text-xl font-bold text-gray-800">Kelola Daftar User</h2>
        </div>
        {currentUser.role !== 'staff' && (
          <button
            onClick={() => {
              setForm({ nama: '', email: '', password: '', role: 'staff', status: 'aktif', foto: null });
              setEditingId(null);
              setPreviewFoto(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Memuat data user...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border-separate border-spacing-y-2">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="bg-white shadow-sm rounded">
                  <td className="px-4 py-2">
                    <img
                      src={`http://localhost:5000${u.foto}`}
                      alt="User Foto"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">{u.nama}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2 capitalize">{u.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {canEditUser(u) && (
                      <button onClick={() => handleEdit(u)} className="text-yellow-600 hover:text-yellow-800">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {canDeleteUser(u) && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-4">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-red-600">
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit User' : 'Tambah User'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-800" encType="multipart/form-data">
              <input
                type="text"
                placeholder="Nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="password"
                placeholder={editingId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              {(currentUser.role === 'owner' || (currentUser.role === 'admin' && editingId !== currentUser.id && form.role !== 'admin')) && (
                <>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    {currentUser.role === 'owner' && <option value="owner">Owner</option>}
                  </select>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border px-3 py-2 rounded"
              />
              {previewFoto && (
                <img src={previewFoto} alt="Preview" className="w-20 h-20 rounded-full object-cover mx-auto border" />
              )}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold">
                {editingId ? 'Update' : 'Tambah'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarUser;
