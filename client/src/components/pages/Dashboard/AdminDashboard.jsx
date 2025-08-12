// AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Calendar,
  Bell,
  TrendingUp,
  Newspaper,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Download,
  FileImage,
  FileText as DocumentIcon
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  fetchDepartmentStats, 
  fetchStudentRegistrations,
  verifyStudentDocuments,
  clearError 
} from '@/redux/slice/departmentAdminSlice';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const departmentAdminState = useSelector((state) => state.departmentAdmin);
  const { 
    stats, 
    registrations, 
    isLoading, 
    error, 
    verificationSuccess 
  } = departmentAdminState || {
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

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);

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
      toast.success('Document verification updated successfully');
      dispatch(fetchDepartmentStats());
      dispatch(fetchStudentRegistrations({}));
    }
  }, [verificationSuccess, dispatch]);

  const handleVerifyDocument = (registrationId, documentType, verified) => {
    dispatch(verifyStudentDocuments({
      registrationId,
      documentType,
      verified: !verified
    }));
  };

  // Filter registrations based on status
  const filteredRegistrations = registrations.filter(reg => {
    if (filterStatus === 'all') return true;
    
    const allVerified = reg.uploads?.courseRegistrationSlip?.verified && 
                       reg.uploads?.schoolFeesReceipt?.verified && 
                       reg.uploads?.hallDuesReceipt?.verified;
    
    return filterStatus === 'completed' ? allVerified : !allVerified;
  });

  // Calculate registration statistics
  const completedRegistrations = registrations.filter(reg => 
    reg.uploads?.courseRegistrationSlip?.verified && 
    reg.uploads?.schoolFeesReceipt?.verified && 
    reg.uploads?.hallDuesReceipt?.verified
  ).length;

  const pendingRegistrations = registrations.length - completedRegistrations;

  // Document statistics
  const documentStats = {
    courseSlip: {
      uploaded: registrations.filter(reg => reg.uploads?.courseRegistrationSlip?.url).length,
      verified: registrations.filter(reg => reg.uploads?.courseRegistrationSlip?.verified).length
    },
    feesReceipt: {
      uploaded: registrations.filter(reg => reg.uploads?.schoolFeesReceipt?.url).length,
      verified: registrations.filter(reg => reg.uploads?.schoolFeesReceipt?.verified).length
    },
    hallDues: {
      uploaded: registrations.filter(reg => reg.uploads?.hallDuesReceipt?.url).length,
      verified: registrations.filter(reg => reg.uploads?.hallDuesReceipt?.verified).length
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {stats.department?.name || 'Department'} Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Manage student registrations, verify documents, and monitor department activities.
          </p>
          <p className="">department of {user?.department?.name}</p>
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
                {isLoading ? '...' : stats.totalRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Registered students</p>
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
                {isLoading ? '...' : completedRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Fully verified students</p>
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
                {isLoading ? '...' : pendingRegistrations}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Require attention</p>
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
                {isLoading ? '...' : stats.department?.programs?.length || 0}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Department programs</p>
            </CardContent>
          </Card>
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
                {isLoading ? '...' : `${documentStats.courseSlip.verified}/${documentStats.courseSlip.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified/Uploaded</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${documentStats.courseSlip.uploaded > 0 ? (documentStats.courseSlip.verified / documentStats.courseSlip.uploaded) * 100 : 0}%` }}
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
                {isLoading ? '...' : `${documentStats.feesReceipt.verified}/${documentStats.feesReceipt.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified/Uploaded</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${documentStats.feesReceipt.uploaded > 0 ? (documentStats.feesReceipt.verified / documentStats.feesReceipt.uploaded) * 100 : 0}%` }}
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
                {isLoading ? '...' : `${documentStats.hallDues.verified}/${documentStats.hallDues.uploaded}`}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Verified/Uploaded</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full" 
                  style={{ width: `${documentStats.hallDues.uploaded > 0 ? (documentStats.hallDues.verified / documentStats.hallDues.uploaded) * 100 : 0}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              Department Tasks
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/courses/create">
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <PlusCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Create Course</CardTitle>
                      <CardDescription>Add a new course to the system</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            
            <Link to="/courses/manage">
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Manage Courses</CardTitle>
                      <CardDescription>Edit or delete existing courses</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
            
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
                      <CardDescription>manage departmental programs</CardDescription>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Student Registrations</h2>
            <div className="flex space-x-2">
              <Button 
                variant={filterStatus === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All Students
              </Button>
              <Button 
                variant={filterStatus === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </Button>
              <Button 
                variant={filterStatus === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterStatus('pending')}
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Program
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Registration Slip
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fees Receipt
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Hall Dues
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Loading student registrations...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No student registrations found
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((registration) => {
                      const allVerified = registration.uploads?.courseRegistrationSlip?.verified && 
                                         registration.uploads?.schoolFeesReceipt?.verified && 
                                         registration.uploads?.hallDuesReceipt?.verified;
                      
                      return (
                        <tr key={registration._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                  <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                                    {registration.student?.firstName?.charAt(0)}{registration.student?.lastName?.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {registration.student?.firstName} {registration.student?.lastName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {registration.student?.studentId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{registration.program?.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{registration.level} Level</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.courseRegistrationSlip?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.courseRegistrationSlip?.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.schoolFeesReceipt?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.schoolFeesReceipt?.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {registration.uploads?.hallDuesReceipt?.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                {registration.uploads?.hallDuesReceipt?.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {allVerified ? (
                              <Badge className="bg-green-100 text-green-800">Completed</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              <Link to={`/dashboard/registration/${registration._id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                              </Link>
                              
                              {registration.uploads?.courseRegistrationSlip?.url && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(registration.uploads.courseRegistrationSlip.url, '_blank')}
                                >
                                  <Download className="h-4 w-4 mr-1" /> Slip
                                </Button>
                              )}
                              
                              {!registration.uploads?.courseRegistrationSlip?.verified && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleVerifyDocument(registration._id, 'courseRegistrationSlip', false)}
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

        {/* Registration Detail Modal */}
        {selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Registration Details
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedRegistration(null)}
                  >
                    Close
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Student Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Name:</span> {selectedRegistration.student?.firstName} {selectedRegistration.student?.lastName}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Student ID:</span> {selectedRegistration.student?.studentId}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email:</span> {selectedRegistration.student?.email}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Phone:</span> {selectedRegistration.student?.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Academic Information</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Program:</span> {selectedRegistration.program?.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Level:</span> {selectedRegistration.level}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Semester:</span> {selectedRegistration.semester}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Registration Date:</span> {new Date(selectedRegistration.registrationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {selectedRegistration.uploads?.courseRegistrationSlip?.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">Registration Slip</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Status: {selectedRegistration.uploads?.courseRegistrationSlip?.verified ? 'Verified' : 'Pending Verification'}
                      </p>
                      {selectedRegistration.uploads?.courseRegistrationSlip?.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedRegistration.uploads.courseRegistrationSlip.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </Button>
                      )}
                      {!selectedRegistration.uploads?.courseRegistrationSlip?.verified && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerifyDocument(selectedRegistration._id, 'courseRegistrationSlip', false)}
                          className="w-full mt-2"
                        >
                          Verify Document
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {selectedRegistration.uploads?.schoolFeesReceipt?.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">Fees Receipt</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Status: {selectedRegistration.uploads?.schoolFeesReceipt?.verified ? 'Verified' : 'Pending Verification'}
                      </p>
                      {selectedRegistration.uploads?.schoolFeesReceipt?.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedRegistration.uploads.schoolFeesReceipt.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </Button>
                      )}
                      {!selectedRegistration.uploads?.schoolFeesReceipt?.verified && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerifyDocument(selectedRegistration._id, 'schoolFeesReceipt', false)}
                          className="w-full mt-2"
                        >
                          Verify Document
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {selectedRegistration.uploads?.hallDuesReceipt?.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className="font-medium">Hall Dues Receipt</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Status: {selectedRegistration.uploads?.hallDuesReceipt?.verified ? 'Verified' : 'Pending Verification'}
                      </p>
                      {selectedRegistration.uploads?.hallDuesReceipt?.url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(selectedRegistration.uploads.hallDuesReceipt.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-1" /> View Document
                        </Button>
                      )}
                      {!selectedRegistration.uploads?.hallDuesReceipt?.verified && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerifyDocument(selectedRegistration._id, 'hallDuesReceipt', false)}
                          className="w-full mt-2"
                        >
                          Verify Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedRegistration.courses && selectedRegistration.courses.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Registered Courses</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                        {selectedRegistration.courses.map((course, index) => (
                          <li key={index} className="py-2">
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">{course.title}</span> ({course.code})
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {course.unit} unit{course.unit !== 1 ? 's' : ''}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;