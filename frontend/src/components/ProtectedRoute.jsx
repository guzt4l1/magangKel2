import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Jika token ada, izinkan akses ke route child
  return <Outlet />;
};

export default ProtectedRoute;
