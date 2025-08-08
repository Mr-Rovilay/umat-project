import { clearError, fetchMyCourses } from '@/redux/slice/courseSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function MyCourses() {
  const dispatch = useDispatch();
  const { myCourses, isLoading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">My Courses</h2>
      {isLoading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
      ) : myCourses.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300">No registered courses</div>
      ) : (
        myCourses.map((registration) => (
          <div key={registration._id} className="mb-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {registration.program.name} - Level {registration.level} - {registration.semester}
            </h3>
            {registration.courses.map((course) => (
              <p key={course._id} className="text-gray-600 dark:text-gray-300">
                {course.title} ({course.code}, {course.unit} units)
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default MyCourses;