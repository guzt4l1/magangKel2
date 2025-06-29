const Jasa = require('../models/jasa');
const KategoriJasa = require('../models/kategoriJasa');
const Akun = require('../models/akun');

// 🔗 Relasi hanya di-deklarasikan di controller
Jasa.belongsTo(KategoriJasa, { foreignKey: 'kategori_id', as: 'KategoriJasa' });
Jasa.belongsTo(Akun, { foreignKey: 'akun_penjualan_id', as: 'Akun' });

// ✅ GET semua jasa + relasi kategori & akun penjualan
exports.getAll = async (req, res) => {
  try {
    const data = await Jasa.findAll({
      include: [
        {
          model: KategoriJasa,
          as: 'KategoriJasa',
          attributes: ['id', 'nama'],
          required: false
        },
        {
          model: Akun,
          as: 'Akun',
          attributes: ['id', 'kode', 'nama'],
          required: false
        }
      ],
      order: [['id', 'ASC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data jasa', error: err.message });
  }
};

// ✅ POST tambah jasa
exports.create = async (req, res) => {
  try {
    const jasa = await Jasa.create(req.body);
    res.status(201).json(jasa);
  } catch (err) {
    res.status(400).json({ message: 'Gagal menambahkan jasa', error: err.message });
  }
};

// ✅ PUT update jasa
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const jasa = await Jasa.findByPk(id);
    if (!jasa) return res.status(404).json({ message: 'Jasa tidak ditemukan' });

    await jasa.update(req.body);
    res.json(jasa);
  } catch (err) {
    res.status(400).json({ message: 'Gagal memperbarui jasa', error: err.message });
  }
};

// ✅ DELETE jasa
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const jasa = await Jasa.findByPk(id);
    if (!jasa) return res.status(404).json({ message: 'Jasa tidak ditemukan' });

    await jasa.destroy();
    res.json({ message: 'Jasa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus jasa', error: err.message });
  }
};
