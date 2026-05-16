import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../features/users/usersSlice';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers({}));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) {
      const res = await dispatch(deleteUser(id));
      if (!res.error) {
        toast.success('User deleted');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((u) => (
            <li key={u._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-primary-600">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email} - {u.role}</p>
              </div>
              <button onClick={() => handleDelete(u._id)} className="text-red-500 text-sm">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
