import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearError, createCourse } from '@/redux/slice/courseSlice';
import { getAllPrograms } from '@/redux/slice/programSlice';
import { getAllDepartments } from '@/redux/slice/departmentSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, BookOpen, Trash } from 'lucide-react';

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { programs, isLoading: programsLoading } = useSelector((state) => state.programs);
  const { departments, isLoading: departmentsLoading } = useSelector((state) => state.departments);
  const { isLoading, creationStatus, error } = useSelector((state) => state.courses);
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      isBulk: false,
      courses: [{ title: '', code: '', unit: '', semester: '', program: '', level: '', department: 'none' }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: 'courses' });
  const isBulk = watch('isBulk');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/student/dashboard');
    } else {
      dispatch(getAllPrograms());
      dispatch(getAllDepartments());
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (creationStatus === 'success') {
      toast.success('Course(s) created successfully');
      dispatch(clearError());
    }
  }, [error, creationStatus, dispatch]);

  const onSubmit = async (data) => {
    const payload = data.isBulk ? data.courses : data.courses[0];
    // Map 'none' to null for department
    const processedPayload = Array.isArray(payload)
      ? payload.map(course => ({
          ...course,
          department: course.department === 'none' ? null : course.department,
        }))
      : {
          ...payload,
          department: payload.department === 'none' ? null : payload.department,
        };
    await dispatch(createCourse(processedPayload));
  };

  // Filter departments to admin's departments
  const allowedDepartments = user?.department?.length > 0
    ? (departments || []).filter(dept => user.department.some(d => d._id?.toString() === dept?._id))
    : (departments || []);

  if (programsLoading || departmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6 animate-fade-in-down">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-fade-in-down">
            Create Course
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-fade-in-up">
            Add new courses for your department
          </p>
        </div>

        {/* Back to Dashboard */}
        <Button
          onClick={() => navigate('/dashboard')}
          className="mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <BookOpen className="mr-2 h-6 w-6 text-emerald-600" />
              {isBulk ? 'Create Multiple Courses' : 'Create Single Course'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bulk Create Toggle */}
              <div className="flex items-center gap-2">
                <Checkbox id="isBulk" {...register('isBulk')} />
                <Label htmlFor="isBulk" className="text-gray-700 dark:text-gray-300 font-medium">
                  Bulk Create
                </Label>
              </div>

              {/* Courses */}
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg dark:border-gray-700 bg-white/30 dark:bg-gray-900/30 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Title */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Title</Label>
                        <Input
                          {...register(`courses.${index}.title`, { required: 'Title is required' })}
                          placeholder="Enter course title"
                          className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                        />
                        {errors.courses?.[index]?.title && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].title.message}</p>
                        )}
                      </div>

                      {/* Code */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Code</Label>
                        <Input
                          {...register(`courses.${index}.code`, { required: 'Code is required' })}
                          placeholder="Enter course code"
                          className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700"
                        />
                        {errors.courses?.[index]?.code && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].code.message}</p>
                        )}
                      </div>

                      {/* Units */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Units</Label>
                        <Controller
                          name={`courses.${index}.unit`}
                          control={control}
                          rules={{ required: 'Units are required' }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                                <SelectValue placeholder="Select Units" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((unit) => (
                                  <SelectItem key={unit} value={unit.toString()}>{unit}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.courses?.[index]?.unit && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].unit.message}</p>
                        )}
                      </div>

                      {/* Semester */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Semester</Label>
                        <Controller
                          name={`courses.${index}.semester`}
                          control={control}
                          rules={{ required: 'Semester is required' }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                                <SelectValue placeholder="Select Semester" />
                              </SelectTrigger>
                              <SelectContent>
                                {['First Semester', 'Second Semester'].map((sem) => (
                                  <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.courses?.[index]?.semester && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].semester.message}</p>
                        )}
                      </div>

                      {/* Program */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Program</Label>
                        <Controller
                          name={`courses.${index}.program`}
                          control={control}
                          rules={{ required: 'Program is required' }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                                <SelectValue placeholder="Select Program" />
                              </SelectTrigger>
                              <SelectContent>
                                {programs?.length > 0 ? (
                                  programs.map((prog) => (
                                    <SelectItem key={prog?._id || index} value={prog?._id || ''}>
                                      {prog?.name || 'Unknown Program'}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No programs available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.courses?.[index]?.program && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].program.message}</p>
                        )}
                      </div>

                      {/* Level */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Level</Label>
                        <Controller
                          name={`courses.${index}.level`}
                          control={control}
                          rules={{ required: 'Level is required' }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                {['100', '200', '300', '400', '500'].map((lvl) => (
                                  <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.courses?.[index]?.level && (
                          <p className="text-red-500 text-sm mt-1">{errors.courses[index].level.message}</p>
                        )}
                      </div>

                      {/* Department */}
                      <div>
                        <Label className="text-gray-700 dark:text-gray-300">Department (Optional)</Label>
                        <Controller
                          name={`courses.${index}.department`}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Department</SelectItem>
                                {allowedDepartments?.length > 0 ? (
                                  allowedDepartments.map((dept) => (
                                    <SelectItem key={dept?._id || index} value={dept?._id || ''}>
                                      {dept?.name || 'Unknown Department'}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none" disabled>No departments available</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    {/* Remove Button for Bulk */}
                    {isBulk && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="flex items-center"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Button for Bulk */}
              {isBulk && (
                <Button
                  type="button"
                  onClick={() => append({ title: '', code: '', unit: '', semester: '', program: '', level: '', department: 'none' })}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Add Another Course
                </Button>
              )}

              {/* Submit */}
              <div className="sticky bottom-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-4 border-t dark:border-gray-700 mt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Course(s)'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreateCourse;