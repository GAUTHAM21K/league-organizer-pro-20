
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Admin-only authentication system
const useAuth = () => {
  // This is a simplified mock - replace with real auth
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return {
    isAuthenticated,
    signIn: () => {
      localStorage.setItem('isAuthenticated', 'true');
    },
    signOut: () => {
      localStorage.removeItem('isAuthenticated');
    }
  };
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export { useAuth };
