import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPrograms } from '../redux/slice/programSlice';
import CourseCard from '../components/CourseCard';
import { toast } from 'sonner';
import { clearError, fetchAvailableCourses } from '@/redux/slice/courseSlice';

function AvailableCourses() {
  const dispatch = useDispatch();
  const { availableCourses, isLoading, error } = useSelector((state) => state.courses);
  const { programs } = useSelector((state) => state.programs);
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      program: user?.program[0]?._id || '',
      level: '',
      semester: '',
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  const onSubmit = (data) => {
    dispatch(fetchAvailableCourses(data));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Available Courses</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-300">Program</label>
          <select
            {...register('program', { required: 'Program is required' })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Program</option>
            {programs.map((prog) => (
              <option key={prog._id} value={prog._id}>
                {prog.name}
              </option>
            ))}
          </select>
          {errors.program && <p className="text-red-500">{errors.program.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-300">Level</label>
          <select
            {...register('level', { required: 'Level is required' })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Level</option>
            {['100', '200', '300', '400', '500'].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
          {errors.level && <p className="text-red-500">{errors.level.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 dark:text-gray-300">Semester</label>
          <select
            {...register('semester', { required: 'Semester is required' })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Semester</option>
            {['First Semester', 'Second Semester'].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
          {errors.semester && <p className="text-red-500">{errors.semester.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800 mt-6 md:mt-0"
        >
          Filter
        </button>
      </form>
      {isLoading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
      ) : availableCourses.length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300">No courses available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailableCourses;