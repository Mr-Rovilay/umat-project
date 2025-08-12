import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

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
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">6</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active courses</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">CWA</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">3.75</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current average</p>
            </CardContent>
          </Card>
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
                    <CardDescription>
                      Browse and register for new courses
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Explore courses</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
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
                    <CardDescription>
                      View your enrolled courses and progress
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <span>View my courses</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
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
                    <CardDescription>
                    Enrolled courses and progress
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <span>View my courses</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
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
                    <CardDescription>
                   Check your payment History
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <span>View my courses</span>
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;