import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Hash, 
  Calendar, 
  Users, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { clearError, fetchAvailableCourses, registerCourses } from '@/redux/slice/courseSlice';
import { getAllPrograms } from '@/redux/slice/programSlice';

function CourseRegistrationForm() {
  const dispatch = useDispatch();
  const { availableCourses, isLoading: courseLoading, error: courseError } = useSelector((state) => state.courses);
  const { programs, isLoading: programLoading, error: programError } = useSelector((state) => state.programs);
  const { user } = useSelector((state) => state.auth);
  
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      program: user?.program?._id || user?.program || '',
      level: '',
      semester: '',
    },
  });
  
  const [selectedCourses, setSelectedCourses] = useState([]);
  const program = watch('program');
  const level = watch('level');
  const semester = watch('semester');

  // Fetch programs on mount
  useEffect(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  // Fetch courses when program, level, and semester are selected
  useEffect(() => {
    if (program && level && semester) {
      dispatch(fetchAvailableCourses({ program, level, semester }));
    }
  }, [program, level, semester, dispatch]);

  // Handle errors
  useEffect(() => {
    if (courseError) {
      toast.error(courseError);
      dispatch(clearError());
    }
    if (programError) {
      toast.error(programError);
      dispatch({ type: 'programs/clearError' });
    }
  }, [courseError, programError, dispatch]);

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
    try {
      const response = await dispatch(
        registerCourses({
          ...data,
          courseIds: selectedCourses,
        })
      ).unwrap();
      toast.success('Courses registered successfully');
      setSelectedCourses([]);
      reset({
        program: user?.program?._id || user?.program || '',
        level: '',
        semester: '',
      });
    } catch (error) {
      toast.error(`Registration failed: ${error}`);
    }
  };

  if (programLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Course Registration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select your courses for the upcoming semester
          </p>
        </div>
        {/* Error Alerts */}
        {courseError && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {courseError}
            </AlertDescription>
          </Alert>
        )}
        {programError && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {programError}
            </AlertDescription>
          </Alert>
        )}
        {/* Registration Form */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Course Registration Form
            </CardTitle>
            <CardDescription>
              Fill in the required information and select your courses for registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Program Field */}
                <div className="space-y-2">
                  <Label htmlFor="program" className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-emerald-500" />
                    Program *
                  </Label>
                  <Controller
                    name="program"
                    control={control}
                    rules={{ required: 'Program is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full dark:bg-gray-800 dark:border-emerald-800 dark:text-white">
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.length === 0 ? (
                            <SelectItem value="" disabled>No programs available</SelectItem>
                          ) : (
                            programs
                              .filter((prog) => !user?.program || prog._id === (user?.program?._id || user?.program))
                              .map((prog) => (
                                <SelectItem key={prog._id} value={prog._id}>
                                  {prog.name}
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.program && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.program.message}
                    </p>
                  )}
                </div>
                {/* Level Field */}
                <div className="space-y-2">
                  <Label htmlFor="level" className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-emerald-500" />
                    Level *
                  </Label>
                  <Controller
                    name="level"
                    control={control}
                    rules={{ required: 'Level is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full dark:bg-gray-800 dark:border-emerald-800 dark:text-white">
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {['100', '200', '300', '400', '500'].map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.level && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.level.message}
                    </p>
                  )}
                </div>
                {/* Semester Field */}
                <div className="space-y-2">
                  <Label htmlFor="semester" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                    Semester *
                  </Label>
                  <Controller
                    name="semester"
                    control={control}
                    rules={{ required: 'Semester is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full dark:bg-gray-800 dark:border-emerald-800 dark:text-white">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {['First Semester', 'Second Semester'].map((sem) => (
                            <SelectItem key={sem} value={sem}>
                              {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.semester && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.semester.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Course Selection */}
              {courseLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300">Loading courses...</p>
                </div>
              ) : availableCourses.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Select Courses
                    </h3>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                      {selectedCourses.length} selected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableCourses.map((course) => (
                      <div 
                        key={course._id} 
                        className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedCourses.includes(course._id)
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:bg-emerald-900/20'
                        }`}
                        onClick={() => toggleCourse(course._id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex items-center justify-center w-5 h-5 rounded border ${
                            selectedCourses.includes(course._id)
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-gray-300 bg-white dark:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{course.code}</p>
                              </div>
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                                {course.unit} units
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses available</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    No courses available for the selected program, level, and semester.
                  </p>
                </div>
              )}
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={courseLoading || !selectedCourses.length || !availableCourses.length}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {courseLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>Register Courses</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseRegistrationForm;