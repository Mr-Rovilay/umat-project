import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Newspaper, 
  AlertCircle, 
  DollarSign 
} from "lucide-react";
import { getAllDepartments } from "@/redux/slice/departmentSlice";
import { toast } from "sonner";

function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || { user: null });
  const { isLoading, error } = useSelector((state) => state.courses || { isLoading: false, error: null });
  const { departments, isLoading: departmentsLoading, error: departmentsError } = useSelector(
    (state) => state.departments || { departments: [], isLoading: false, error: null }
  );
  
  // Mock owing status (replace with actual data from Redux or backend)
  const owingStatus = useSelector((state) => state.student?.owingStatus || {
    schoolFees: 0,
    departmentalDues: 0,
    hasOutstanding: false
  });

  useEffect(() => {
    dispatch(getAllDepartments()).then((result) => {
      if (result.error) {
        toast.error("Failed to load departments");
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (departmentsError) {
      toast.error(departmentsError);
    }
  }, [error, departmentsError]);

  const userDepartmentNames = useMemo(() => {
    if (!user?.department?.length || !departments.length) return [];
    return user.department
      .map((deptId) => departments.find((d) => d._id === deptId)?.name || "Unknown Department")
      .filter(Boolean);
  }, [user, departments]);

  if (isLoading || departmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || departmentsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error loading dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{error || departmentsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Student Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Welcome back,{" "}
            <Link
              to="/profile"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4 decoration-2 transition-all duration-200 hover:decoration-indigo-500"
            >
              {user?.firstName} {user?.lastName}
            </Link>
            ! Manage your academic journey with ease.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Owing Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {owingStatus.hasOutstanding ? (
                  <span className="text-red-600 dark:text-red-400">Owing</span>
                ) : (
                  <span className="text-green-600 dark:text-green-400">Cleared</span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {owingStatus.hasOutstanding
                  ? `₦₵{(owingStatus.schoolFees + owingStatus.departmentalDues).toLocaleString()} outstanding`
                  : "All fees paid"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/courses/my-courses">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Slip Registration</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View your registered courses
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
                      Register your slips this semester
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
          <Link to="/news">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <Newspaper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Departmental News</CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stay updated with department news
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