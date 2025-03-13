
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

// Mock authentication - In a real app, use a proper auth system
const useAuth = () => {
  // This is a simplified mock - replace with real auth
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole') || 'user';
  
  return {
    isAuthenticated,
    userRole,
    signIn: (role: string) => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
    },
    signOut: () => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    }
  };
};

export const ProtectedRoute = ({ children, isAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (isAdmin && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export { useAuth };
