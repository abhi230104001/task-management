import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-medium text-gray-600 mt-4">Page Not Found</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
