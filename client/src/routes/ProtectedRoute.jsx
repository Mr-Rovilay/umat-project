import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a specific role and user role doesn't match
  if (role && user?.role !== role) {
    // Redirect based on user role
    const redirectTo = user?.role === 'admin' ? '/dashboard' : '/student/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Allow access if authenticated and role matches (or no role specified)
  return children;
};

export default ProtectedRoute;