import { clearError, fetchMyCourses } from '@/redux/slice/courseSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Hash,
  Calendar,
  Loader2,
  AlertCircle,
  GraduationCap,
  Clock
} from 'lucide-react';

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading your courses...</p>
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
            My Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View your registered courses for the current semester
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

        {/* Content */}
        {myCourses.length === 0 ? (
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                You haven't registered for any courses yet. Please visit the course registration page to enroll in courses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {myCourses.map((registration) => (
              <Card key={registration._id} className="border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <CardTitle className="text-xl flex items-center text-emerald-800 dark:text-emerald-200">
                      <BookOpen className="mr-2 h-5 w-5" />
                      {registration.program.name}
                    </CardTitle>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                        <Hash className="h-3 w-3" />
                        Level {registration.level}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                        <Calendar className="h-3 w-3" />
                        {registration.semester}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-emerald-700 dark:text-emerald-300">
                    {registration.courses.length} course{registration.courses.length !== 1 ? 's' : ''} registered
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registration.courses.map((course) => (
                      <div key={course._id} className="p-4 border border-emerald-100 dark:border-emerald-900/50 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.code}</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200">
                            {course.unit} unit{course.unit !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>Registered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;