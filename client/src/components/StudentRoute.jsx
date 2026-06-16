import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'STUDENT') return <Navigate to="/admin" replace />;
  return children;
};

export default StudentRoute;
