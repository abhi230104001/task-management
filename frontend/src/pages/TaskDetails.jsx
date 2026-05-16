import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTask } from '../features/tasks/tasksSlice';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const TaskDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { task, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getTask(id));
  }, [dispatch, id]);


  if (isLoading || !task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Task details and information.</p>
          </div>
          <Link to={`/tasks/${task._id}/edit`} className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Edit</Link>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{task.status}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{task.priority}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.createdBy?.name || 'Unknown'}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{task.description}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {task.attachments?.map((doc) => {
                    const isLocal = doc.secure_url.includes('/api/files/download');
                    const token = localStorage.getItem('token');
                    const backendHost = import.meta.env.VITE_SOCKET_URL || '';
                    const absoluteUrl = isLocal ? `${backendHost}${doc.secure_url}` : doc.secure_url;
                    
                    const viewUrl = isLocal ? `${absoluteUrl}?token=${token}` : doc.secure_url;
                    const downloadUrl = isLocal ? `${absoluteUrl}?token=${token}` : doc.secure_url.replace('/upload/', '/upload/fl_attachment/');

                    return (
                      <li key={doc._id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">{doc.originalName}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex space-x-4">
                          <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:text-primary-500">
                            View PDF
                          </a>
                          <a href={downloadUrl} download className="font-medium text-green-600 hover:text-green-500">
                            Download PDF
                          </a>
                        </div>
                      </li>
                    );
                  })}
                  {(!task.attachments || task.attachments.length === 0) && (
                    <li className="pl-3 pr-4 py-3 text-sm text-gray-500">No attachments available</li>
                  )}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
