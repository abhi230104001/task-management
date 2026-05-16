import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, CheckSquare, Users, User } from 'lucide-react';
const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">Task System</span>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-6 w-6" />
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <CheckSquare className="mr-3 h-6 w-6" />
            Tasks
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <User className="mr-3 h-6 w-6" />
            Profile
          </NavLink>
          {user && user.role === 'admin' && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Users className="mr-3 h-6 w-6" />
              Users Management
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
