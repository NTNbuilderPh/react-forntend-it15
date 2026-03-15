import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { loadingAuth } = useAuth();
  const token = localStorage.getItem('token');

  if (loadingAuth) return <LoadingSpinner text="Checking authentication..." />;

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;