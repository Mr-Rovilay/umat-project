import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPrograms } from '../redux/slice/programSlice';
import CourseCard from '../components/CourseCard';
import { toast } from 'sonner';
import { clearError, fetchAvailableCourses } from '@/redux/slice/courseSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Hash,
  Calendar,
  Loader2,
  AlertCircle,
  GraduationCap,
  Filter
} from 'lucide-react';

function AvailableCourses() {
  const dispatch = useDispatch();
  const { availableCourses, isLoading, error } = useSelector((state) => state.courses);
  const { programs, isLoading: programLoading } = useSelector((state) => state.programs);
  const { user } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      program: user?.program?._id || user?.program || '',
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
            Available Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse and filter courses available for registration
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Filter Form */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Filter className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Filter Courses
            </CardTitle>
            <CardDescription>
              Select program, level, and semester to view available courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              <div className="space-y-2">
                <Label htmlFor="program" className="flex items-center">
                  <Hash className="mr-2 h-4 w-4 text-emerald-500" />
                  Program *
                </Label>
                <select
                  {...register('program', { required: 'Program is required' })}
                  className="w-full p-3 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Program</option>
                  {programs.map((prog) => (
                    <option key={prog._id} value={prog._id}>
                      {prog.name}
                    </option>
                  ))}
                </select>
                {errors.program && (
                  <p className="text-sm text-red-500">{errors.program.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center">
                  <Hash className="mr-2 h-4 w-4 text-emerald-500" />
                  Level *
                </Label>
                <select
                  {...register('level', { required: 'Level is required' })}
                  className="w-full p-3 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Level</option>
                  {['100', '200', '300', '400', '500'].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p className="text-sm text-red-500">{errors.level.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
                  Semester *
                </Label>
                <select
                  {...register('semester', { required: 'Semester is required' })}
                  className="w-full p-3 border border-emerald-200 dark:border-emerald-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Semester</option>
                  {['First Semester', 'Second Semester'].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="text-sm text-red-500">{errors.semester.message}</p>
                )}
              </div>
              
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Courses Display */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Available Courses
              </CardTitle>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                {availableCourses.length} courses
              </Badge>
            </div>
            <CardDescription>
              Browse courses that match your selected criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
                <p className="text-gray-700 dark:text-gray-300">Loading courses...</p>
              </div>
            ) : availableCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses available</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No courses match your selected criteria. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AvailableCourses;