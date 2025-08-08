import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { clearError, createCourse } from '@/redux/slice/courseSlice';
import { getAllPrograms } from '@/redux/slice/programSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';

function CreateCourse() {
  const dispatch = useDispatch();
  const { programs } = useSelector((state) => state.programs);
  const { departments } = useSelector((state) => state.departments);
  const { isLoading, error } = useSelector((state) => state.courses);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      isBulk: false,
      courses: [{ title: '', code: '', unit: '', semester: '', program: '', level: '', department: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'courses' });
  const isBulk = watch('isBulk');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(getAllPrograms());
    dispatch(getAllDepartments());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const payload = data.isBulk ? data.courses : data.courses[0];
    const response = await dispatch(createCourse(payload));
    if (createCourse.fulfilled.match(response)) {
      toast.success('Course(s) created successfully');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-5">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Create Course
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bulk Create Toggle */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isBulk')} className="h-5 w-5" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Bulk Create</span>
        </div>

        {/* Courses */}
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Title */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    {...register(`courses.${index}.title`, { required: 'Title is required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.courses?.[index]?.title && <p className="text-red-500 text-sm">{errors.courses[index].title.message}</p>}
                </div>

                {/* Code */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Code</label>
                  <input
                    {...register(`courses.${index}.code`, { required: 'Code is required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.courses?.[index]?.code && <p className="text-red-500 text-sm">{errors.courses[index].code.message}</p>}
                </div>

                {/* Units */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Units</label>
                  <select
                    {...register(`courses.${index}.unit`, { required: 'Units are required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Units</option>
                    {[1, 2, 3, 4, 5].map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.unit && <p className="text-red-500 text-sm">{errors.courses[index].unit.message}</p>}
                </div>

                {/* Semester */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Semester</label>
                  <select
                    {...register(`courses.${index}.semester`, { required: 'Semester is required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Semester</option>
                    {['First Semester', 'Second Semester'].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.semester && <p className="text-red-500 text-sm">{errors.courses[index].semester.message}</p>}
                </div>

                {/* Program */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Program</label>
                  <select
                    {...register(`courses.${index}.program`, { required: 'Program is required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Program</option>
                    {programs.map((prog) => (
                      <option key={prog._id} value={prog._id}>{prog.name}</option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.program && <p className="text-red-500 text-sm">{errors.courses[index].program.message}</p>}
                </div>

                {/* Level */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Level</label>
                  <select
                    {...register(`courses.${index}.level`, { required: 'Level is required' })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Level</option>
                    {['100', '200', '300', '400', '500'].map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                  {errors.courses?.[index]?.level && <p className="text-red-500 text-sm">{errors.courses[index].level.message}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300">Department</label>
                  <select
                    {...register(`courses.${index}.department`)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Department (Optional)</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remove button for bulk */}
              {isBulk && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Button for Bulk */}
        {isBulk && (
          <button
            type="button"
            onClick={() => append({ title: '', code: '', unit: '', semester: '', program: '', level: '', department: '' })}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Another Course
          </button>
        )}

        {/* Submit */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Course(s)'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourse;
