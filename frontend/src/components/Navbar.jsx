import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { LogOut } from 'lucide-react';
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-primary-500">
      <div className="flex items-center">
        {}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-sm font-medium">
          Welcome, {user?.name}
        </span>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-500 hover:text-primary-600 focus:outline-none"
        >
          <LogOut className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
};
export default Navbar;
