# magangKel6

| Area                    | Saran                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mapping Akun**        | Pastikan setiap transaksi menyimpan `akun_debet` dan `akun_kredit` secara eksplisit, atau bisa diturunkan dari jenisnya                     |
| **Enum/kode transaksi** | Tambahkan field `jenis_transaksi` atau `tipe`, agar saat kamu loop bisa tahu logikanya (misal `penerimaan_utang`, `pengeluaran_beban`, dll) |
| **Reusable utils**      | Buat helper `generateJurnalFromTransaksi(transaksi)` di backend untuk reusable logic                                                        |
| **Filter per akun**     | Untuk laporan buku besar, kamu hanya perlu filter dari `jurnal` berdasarkan `akun_id`                                                       |
