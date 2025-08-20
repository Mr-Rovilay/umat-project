// AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  BookOpen,
  Users,
  Settings,
  TrendingUp,
  Newspaper,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Download,
  FileImage,
  FileText as DocumentIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchDepartmentStats,
  fetchStudentRegistrations,
  verifyStudentDocuments,
  clearError,
} from "@/redux/slice/departmentAdminSlice";
import OnlineStudentsCard from "@/components/OnlineStudentsCard";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector(
    (state) => state.departments || { departments: [], isLoading: false }
  );
  const departmentAdminState = useSelector((state) => state.departmentAdmin);
  const { stats, registrations, isLoading, error, verificationSuccess } =
    departmentAdminState || {
      stats: {
        department: null,
        totalRegistrations: 0,
        registrationsBySemester: [],
        registrationsByLevel: [],
        pendingVerifications: [],
        paymentStats: [],
      },
      registrations: [],
      isLoading: false,
      error: null,
      verificationSuccess: false,
    };
  const deptName = user.department?.[0]?.name;

  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (user?.department) {
      dispatch(fetchDepartmentStats());
      dispatch(fetchStudentRegistrations({}));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (verificationSuccess) {
      dispatch(fetchDepartmentStats());
      dispatch(fetchStudentRegistrations({}));
    }
  }, [verificationSuccess, dispatch]);

  const handleVerifyDocument = (registrationId, documentType, verified) => {
    dispatch(
      verifyStudentDocuments({
        registrationId,
        documentType,
        verified: !verified,
      })
    );
  };

  const userDepartmentNames = useMemo(() => {
    if (!user || !user.department) return [];

    // Handle both array and single department cases
    const departmentIds = Array.isArray(user.department)
      ? user.department.map((dept) =>
          typeof dept === "object" ? dept._id : dept
        )
      : [
          typeof user.department === "object"
            ? user.department._id
            : user.department,
        ];

    return departments
      .filter((dept) => departmentIds.includes(dept._id))
      .map((dept) => dept.name);
  }, [user, departments]);

  // Filter registrations based on status
  const filteredRegistrations = registrations.filter((reg) => {
    if (filterStatus === "all") return true;

    const allVerified =
      reg.uploads?.courseRegistrationSlip?.verified &&
      reg.uploads?.schoolFeesReceipt?.verified &&
      reg.uploads?.hallDuesReceipt?.verified;

    return filterStatus === "completed" ? allVerified : !allVerified;
  });

  // Calculate registration statistics
  const completedRegistrations = registrations.filter(
    (reg) =>
      reg.uploads?.courseRegistrationSlip?.verified &&
      reg.uploads?.schoolFeesReceipt?.verified &&
      reg.uploads?.hallDuesReceipt?.verified
  ).length;

  const pendingRegistrations = registrations.length - completedRegistrations;

  // Document statistics
  const documentStats = {
    courseSlip: {
      uploaded: registrations.filter(
        (reg) => reg.uploads?.courseRegistrationSlip?.url
      ).length,
      verified: registrations.filter(
        (reg) => reg.uploads?.courseRegistrationSlip?.verified
      ).length,
    },
    feesReceipt: {
      uploaded: registrations.filter(
        (reg) => reg.uploads?.schoolFeesReceipt?.url
      ).length,
      verified: registrations.filter(
        (reg) => reg.uploads?.schoolFeesReceipt?.verified
      ).length,
    },
    hallDues: {
      uploaded: registrations.filter((reg) => reg.uploads?.hallDuesReceipt?.url)
        .length,
      verified: registrations.filter(
        (reg) => reg.uploads?.hallDuesReceipt?.verified
      ).length,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-pad-container mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard For {" "}
            {user?.department?.[0]?.name || "No Department Assigned"}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Manage student registrations, verify documents, and monitor
            department activities. {user.department.name}jnjn
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Students</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading ? "..." : stats.totalRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Completed</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading ? "..." : completedRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fully verified students
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pending</CardTitle>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading ? "..." : pendingRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Programs</CardTitle>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading ? "..." : stats.department?.programs?.length || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Department programs
              </p>
            </CardContent>
          </Card>
          <OnlineStudentsCard />
        </div>

        {/* Document Upload Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Registration Slips</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <DocumentIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading
                  ? "..."
                  : `${documentStats.courseSlip.verified}/${documentStats.courseSlip.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verified/Uploaded
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      documentStats.courseSlip.uploaded > 0
                        ? Math.min(
                            (documentStats.courseSlip.verified /
                              documentStats.courseSlip.uploaded) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Fees Receipts</CardTitle>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading
                  ? "..."
                  : `${documentStats.feesReceipt.verified}/${documentStats.feesReceipt.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verified/Uploaded
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      documentStats.feesReceipt.uploaded > 0
                        ? Math.min(
                            (documentStats.feesReceipt.verified /
                              documentStats.feesReceipt.uploaded) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Hall Dues</CardTitle>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <FileImage className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {isLoading
                  ? "..."
                  : `${documentStats.hallDues.verified}/${documentStats.hallDues.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verified/Uploaded
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-amber-600 h-2 rounded-full"
                  style={{
                    width: `${
                      documentStats.hallDues.uploaded > 0
                        ? Math.min(
                            (documentStats.hallDues.verified /
                              documentStats.hallDues.uploaded) *
                              100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-600"
            >
              Department Tasks
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/news/create">
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <Newspaper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Create News</CardTitle>
                      <CardDescription>Create department news</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/dashboard/programs">
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <Newspaper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Manage Programs</CardTitle>
                      <CardDescription>
                        manage departmental programs
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            <Link to="/dashboard/departments">
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <Newspaper className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Department</CardTitle>
                      <CardDescription>Manage department</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Student Registrations Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Student Registrations
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Students
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Program
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Registration Slip
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Fees Receipt
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Hall Dues
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        Loading student registrations...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No student registrations found
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((registration) => {
                      const allVerified =
                        registration.uploads?.courseRegistrationSlip
                          ?.verified &&
                        registration.uploads?.schoolFeesReceipt?.verified &&
                        registration.uploads?.hallDuesReceipt?.verified;

                      return (
                        <tr
                          key={registration._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-750"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                  <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                                    {registration.student?.firstName?.charAt(0)}
                                    {registration.student?.lastName?.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {registration.student?.firstName}{" "}
                                  {registration.student?.lastName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {registration.student?.studentId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white truncate w-30">
                              {registration.program?.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {registration.level} Level
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.courseRegistrationSlip
                                ?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.courseRegistrationSlip
                                  ?.verified
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.schoolFeesReceipt
                                ?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.schoolFeesReceipt
                                  ?.verified
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.hallDuesReceipt
                                ?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.hallDuesReceipt?.verified
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {allVerified ? (
                              <Badge className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                to={`/dashboard/registration/${registration._id}`}
                              >
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </Link>

                              {registration.uploads?.courseRegistrationSlip
                                ?.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(
                                      registration.uploads
                                        .courseRegistrationSlip.url,
                                      "_blank"
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4 mr-1" /> Slip
                                </Button>
                              )}

                              {!registration.uploads?.courseRegistrationSlip
                                ?.verified && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleVerifyDocument(
                                      registration._id,
                                      "courseRegistrationSlip",
                                      false
                                    )
                                  }
                                >
                                  Verify
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
