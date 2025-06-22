import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

const DaftarUser = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'staff', foto: null });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

  const API = 'http://localhost:5000/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
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
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      if (form.password) formData.append('password', form.password);
      formData.append('role', form.role);
      if (form.foto) formData.append('foto', form.foto);

      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(API, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setForm({ email: '', password: '', role: 'staff', foto: null });
      setEditingId(null);
      setPreviewFoto(null);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Gagal menyimpan user.');
    }
  };

  const handleEdit = (user) => {
    setForm({ email: user.email, password: '', role: user.role, foto: null });
    setPreviewFoto(`http://localhost:5000${user.foto}`);
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition"
        title="Kembali"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <h2 className="text-lg font-bold text-center mb-6">Kelola Daftar User</h2>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => {
            setForm({ email: '', password: '', role: 'staff', foto: null });
            setEditingId(null);
            setPreviewFoto(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Foto</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:5000${u.foto}`}
                    alt="User Foto"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => handleEdit(u)} className="text-yellow-600 hover:text-yellow-800">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  Tidak ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit User' : 'Tambah User'}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 text-gray-800" encType="multipart/form-data">
  <input
    type="email"
    placeholder="Email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    required
    className="w-full p-2 bg-white border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <input
    type="password"
    placeholder={editingId ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    className="w-full p-2 bg-white border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <select
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
    className="w-full p-2 bg-white border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="staff">Staff</option>
    <option value="admin">Admin</option>
  </select>

  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="w-full p-2 bg-white border border-gray-300 rounded file:text-gray-600 file:bg-gray-100 file:border file:border-gray-300 file:rounded file:px-3 file:py-1"
  />

  {previewFoto && (
    <img
      src={previewFoto}
      alt="Preview"
      className="w-20 h-20 rounded-full object-cover mx-auto border border-gray-300"
    />
  )}

  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded w-full font-semibold"
  >
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
