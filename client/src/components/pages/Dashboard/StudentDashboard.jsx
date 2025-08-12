import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard
} from 'lucide-react';
import { selectTotalEnrolledCourses } from '@/redux/slice/courseSlice';

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.courses);
  const totalEnrolledCourses = useSelector(selectTotalEnrolledCourses);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Welcome back, {user?.firstName} {user?.lastName}! Here's an overview of your academic progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Enrolled Courses Card */}
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Enrolled Courses</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {totalEnrolledCourses}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalEnrolledCourses === 1 ? 'Active course' : 'Active courses'}
              </p>
            </CardContent>
          </Card>

          {/* Add other dashboard cards here */}
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/courses/available">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Available Courses</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Browse and register for new courses
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/courses/my-courses">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Courses</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View your enrolled courses and progress
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/courses/register">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Course Registration</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Register for new courses
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/student/payments/history">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View your payment records
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;