### ✅ **Penempatan Tabel ke dalam Komponen `Data`**

| Tabel Database          | Komponen Frontend          | Keterangan Fungsional                                        |
| ----------------------- | -------------------------- | ------------------------------------------------------------ |
| `saldo_awal`            | Data Saldo Awal            | Menyimpan saldo awal setiap akun per tahun.                  |
| `jasa`                  | Data Jasa                  | Digunakan saat input penjualan jasa.                         |
| `kategori_jasa`         | Data Kategori Jasa         | Kategori jasa seperti "jasa konsultasi", "jasa servis", dll. |
| `pelanggan`             | Data Pelanggan             | Menyimpan data pelanggan untuk penjualan.                    |
| `pemasok`               | Data Pemasok               | Menyimpan data vendor untuk pembelian aset/beban.            |
| `bank`                  | Data Bank                  | Digunakan untuk semua transaksi terkait rekening bank.       |
| `aset`                  | Data Aset                  | Aset utama perusahaan, seperti kendaraan, gedung, dll.       |
| `aset_lain`             | Data Aset Lain             | Aset tidak tetap atau aset tidak berwujud lainnya.           |
| `pemberi_pinjaman`      | Data Pemberi Pinjaman      | Digunakan untuk pencatatan utang dari pihak eksternal.       |
| `bank_pemberi_pinjaman` | Data Bank Pemberi Pinjaman | Jika pinjaman melalui bank tertentu.                         |
| `beban_lain`            | Data Beban Lain            | Kategori beban tidak rutin atau beban tambahan.              |

---

### ✅ **Penempatan Tabel ke dalam Komponen Transaksi: `Penerimaan`**

| Nama Transaksi             | Tabel yang Digunakan | Keterangan                                            |
| -------------------------- | -------------------- | ----------------------------------------------------- |
| Penjualan                  | `penjualan`          | Transaksi pendapatan dari pelanggan.                  |
| Utang                      | `penerimaan_utang`   | Jika menerima uang dari pinjaman.                     |
| Modal                      | `penerimaan_modal`   | Tambahan modal dari pemilik.                          |
| Penarikan dari Bank        | `penarikan_bank`     | Pindahan dana dari bank ke kas.                       |
| Pendapatan Diterima Dimuka | `pendapatan_dimuka`  | Pendapatan diterima tetapi belum diakui secara penuh. |
| Penghasilan Lain           | `penghasilan_lain`   | Penerimaan selain penjualan utama.                    |

---

### ✅ **Penempatan Tabel ke dalam Komponen Transaksi: `Pengeluaran`**

| Nama Transaksi            | Tabel yang Digunakan    | Keterangan                                        |
| ------------------------- | ----------------------- | ------------------------------------------------- |
| Kewajiban                 | `pengeluaran_kewajiban` | Pembayaran utang dan kewajiban lain.              |
| Pembelian Aset            | `pembelian_aset`        | Transaksi aset masuk (tanpa penyusutan otomatis). |
| Beban                     | `pengeluaran_beban`     | Beban rutin seperti listrik, gaji, dll.           |
| Penghapusan Piutang       | `penghapusan_piutang`   | Pengakuan piutang tak tertagih.                   |
| Setoran ke Bank           | `setoran_bank`          | Pemindahan dana dari kas ke rekening bank.        |
| Penarikan Modal           | `penarikan_modal`       | Penarikan modal oleh pemilik.                     |
| Pemindahan Saldo Rekening | `transfer_rekening`     | Antar bank.                                       |
| Beban Dibayar Dimuka      | `beban_dibayar_dimuka`  | Beban yang dibayar lebih awal.                    |

---

### ✅ **Penempatan Tabel/Tampilan ke dalam Halaman `Laporan`**

| Halaman Laporan                  | Sumber Tabel dan Fungsi                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| **Posisi Keuangan (Neraca)**     | `akun`, `saldo_awal`, transaksi aset, kewajiban, ekuitas            |
| **Rincian**                      | Detail per akun, sumber: seluruh tabel transaksi + `akun`           |
| **Laba Rugi & Saldo Laba**       | `akun`, transaksi `pendapatan` dan `beban`                          |
| **Arus Kas**                     | Berdasarkan `kas/bank` keluar/masuk dari transaksi                  |
| **History Transaksi**            | Log seluruh transaksi dari semua jenis (dari semua tabel transaksi) |
| **Kinerja Keuangan**             | Rekap penjualan, margin, tren, dibandingkan periode                 |
| **Trend**                        | Time series dari `penjualan`, `beban`, dll.                         |
| **Analisis Beban Usaha Tahunan** | Agregat dari tabel `pengeluaran_beban` per bulan/tahun              |
                            