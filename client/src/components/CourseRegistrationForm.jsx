import { clearError, fetchAvailableCourses, registerCourses } from '@/redux/slice/courseSlice';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function CourseRegistrationForm() {
  const dispatch = useDispatch();
  const { availableCourses, isLoading, error } = useSelector((state) => state.courses);
  const { programs } = useSelector((state) => state.programs);
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      program: user?.program[0]?._id || '',
      level: '',
      semester: '',
    },
  });
  const [selectedCourses, setSelectedCourses] = useState([]);

  const program = watch('program');
  const level = watch('level');
  const semester = watch('semester');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (program && level && semester) {
      dispatch(fetchAvailableCourses({ program, level, semester }));
    }
  }, [program, level, semester, dispatch]);

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const onSubmit = async (data) => {
    if (!selectedCourses.length) {
      toast.error('Please select at least one course');
      return;
    }
    const response = await dispatch(
      registerCourses({
        ...data,
        courseIds: selectedCourses,
      })
    );
    if (registerCourses.fulfilled.match(response)) {
      toast.success('Courses registered successfully');
      setSelectedCourses([]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
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
        <div>
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
        <div>
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
      </div>
      {availableCourses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Select Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {availableCourses.map((course) => (
              <div key={course._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => toggleCourse(course._id)}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {course.title} ({course.code}, {course.unit} units)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading || !selectedCourses.length}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-800"
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default CourseRegistrationForm;