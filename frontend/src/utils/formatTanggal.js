// utils/formatTanggal.js
export function formatTanggal(dateString) {
  const tanggal = new Date(dateString);
  return tanggal.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
