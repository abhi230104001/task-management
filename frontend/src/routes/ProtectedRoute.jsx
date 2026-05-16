import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ children }) => {
  const { token, user, isLoading } = useSelector((state) => state.auth);
  if (!token && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  if (!user && isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  return children;
};
export default ProtectedRoute;
