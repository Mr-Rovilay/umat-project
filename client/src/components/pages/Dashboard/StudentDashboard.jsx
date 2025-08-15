import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, CreditCard } from "lucide-react";

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.courses);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Loading dashboard...
          </p>
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
    <div className="max-pad-container bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Student Dashboard
          </h1>
          <div className="text-center mb-8">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-all duration-300 transform hover:scale-105">
              Welcome back,{" "}
              <Link
                to="/profile"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4 decoration-2 transition-all duration-200 hover:decoration-indigo-500"
              >
                {user?.firstName} {user?.lastName}
              </Link>
              ! Here's an overview of your academic progress.
            </p>

            {/* Subtle decorative element */}
            <div className="mt-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto opacity-70"></div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <Link to="/courses/my-courses">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Registration</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View your registration
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
                    <CardTitle className="text-lg">Registration</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Register for your slips for the semester
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
