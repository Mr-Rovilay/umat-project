import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Welcome, {user?.firstName} {user?.lastName}
      </h1>
      <div className="space-x-4">
        <Link
          to="/courses/available"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Available Courses
        </Link>
        <Link
          to="/courses/my-courses"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          My Courses
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;