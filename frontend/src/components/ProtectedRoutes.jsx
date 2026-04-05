import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RootRoute = ({ children }) => {
  const { user } = useAuth();

  // If not logged in, redirect to /login
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, check role for redirection
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

  // If not logged in, allow access to login/register pages
  if (!user || !user.token) {
    return children;
  }

  // If already logged in, check role and redirect accordingly
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'entrepreneur') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};