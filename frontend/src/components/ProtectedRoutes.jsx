import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RootRoute = ({ children }) => {
  const { user } = useAuth();

  // Nếu chưa đăng nhập, redirect đến /login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, kiểm tra role
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'entrepreneur') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export const AuthRoute = ({ children }) => {
  const { user } = useAuth();

  // Nếu chưa đăng nhập, cho phép truy cập trang login/register
  if (!user || !user.token) {
    return children;
  }

  // Nếu đã đăng nhập, kiểm tra role và redirect
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'entrepreneur') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};
