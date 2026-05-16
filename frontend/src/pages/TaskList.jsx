import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, deleteTask, reset } from '../features/tasks/tasksSlice';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);
  
  const [taskTypeFilter, setTaskTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [sortOption, setSortOption] = useState('-createdAt');

  useEffect(() => {
    console.log('Current Filter State:', { taskTypeFilter, statusFilter, priorityFilter, dueDateFilter, sortOption });
    
    const params = {};
    if (sortOption) params.sort = sortOption;
    if (taskTypeFilter && taskTypeFilter !== 'all') params.type = taskTypeFilter;
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (dueDateFilter) params.dueDate = dueDateFilter;
    
    console.log('API Query Params:', params);
    
    dispatch(getTasks(params)).then((res) => {
      if (res.payload && res.payload.data) {
        console.log('API Response Count:', res.payload.data.length);
      }
    });
  }, [dispatch, taskTypeFilter, statusFilter, priorityFilter, dueDateFilter, sortOption]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const clearFilters = () => {
    setTaskTypeFilter('all');
    setStatusFilter('');
    setPriorityFilter('');
    setDueDateFilter('');
    setSortOption('-createdAt');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Link
          to="/tasks/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Create Task
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={taskTypeFilter}
          onChange={(e) => setTaskTypeFilter(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="all">All Tasks</option>
          <option value="assigned">Assigned To Me</option>
          <option value="created">Created By Me</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="dueDate">Due Date (Earliest)</option>
          <option value="-dueDate">Due Date (Latest)</option>
        </select>

        <button 
          onClick={clearFilters}
          className="mt-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task._id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-primary-600 truncate">{task.title}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          in {task.status}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500 mr-4">
                          Priority: {task.priority}
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center text-sm text-gray-500">
                            Assigned to: {task.assignedTo.name} ({task.assignedTo.email})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <Link to={`/tasks/${task._id}`} className="text-gray-400 hover:text-gray-500">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link to={`/tasks/${task._id}/edit`} className="text-blue-400 hover:text-blue-500">
                      <Edit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(task._id)} className="text-red-400 hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="p-4 text-center text-gray-500">No tasks found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
