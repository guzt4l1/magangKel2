import Sidebar from '../Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useIdleTimer from '../../hooks/useIdleTimer';
import Swal from 'sweetalert2';

export default function MainLayout() {
  const navigate = useNavigate();

  useIdleTimer(1 * 60 * 1000, () => {
    Swal.fire({
      title: 'Sesi Timeout',
      html: 'Anda tidak aktif selama 15 menit.<br>Silakan login kembali.',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      background: '#1f2937',
      color: '#f9fafb',
    }).then(() => {
      localStorage.clear();
      navigate('/');
    });
  });

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto p-6 bg-gray-800 text-white">
        <Outlet />
      </div>
    </div>
  );
}
