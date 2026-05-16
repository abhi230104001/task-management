import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../utils/socket';
import { taskCreatedBySocket, taskUpdatedBySocket, taskDeletedBySocket } from '../features/tasks/tasksSlice';
import toast from 'react-hot-toast';
const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('joinRoom', user._id);
      socket.on('taskCreated', (task) => {
        dispatch(taskCreatedBySocket(task));
        toast.success(`New task created: ${task.title}`);
      });
      socket.on('taskUpdated', (task) => {
        dispatch(taskUpdatedBySocket(task));
        toast.success(`Task updated: ${task.title}`);
      });
      socket.on('taskDeleted', (data) => {
        dispatch(taskDeletedBySocket(data));
        toast.success('A task was deleted');
      });
      return () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
        socket.disconnect();
      };
    }
  }, [user, dispatch]);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
