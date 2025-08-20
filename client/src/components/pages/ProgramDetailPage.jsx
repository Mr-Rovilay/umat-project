import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  Loader2, 
  AlertCircle, 
  GraduationCap, 
  Clock, 
  Users, 
  Award, 
  Building, 
  Mail, 
  User, 
  Hash,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProgram, clearError } from '@/redux/slice/programSlice';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // Access the Redux state correctly
  const { currentProgram, programs, isLoading, error } = useSelector((state) => state.programs);
  
  console.log("Current Program:", currentProgram);
  console.log("All Programs:", programs);
  console.log("ID:", id);
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    dispatch(getProgram(id));
    setIsVisible(true);
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading program details...</p>
    </div>
  );

  const AdminCard = ({ admin }) => (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {admin.firstName} {admin.lastName}
            </h4>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{admin.email}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Hash className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{admin.referenceNumber}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="outline" className="text-xs">
              {admin.role}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DepartmentSection = ({ department }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Building className="w-5 h-5 text-emerald-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{department.name}</h3>
      </div>
      
      {department.admins && department.admins.length > 0 ? (
        <div>
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Administrators</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {department.admins.map((admin) => (
              <AdminCard key={admin._id} admin={admin} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No administrators assigned</p>
        </div>
      )}
    </div>
  );

  // Calculate total admins across all departments
  const totalAdmins = currentProgram?.department?.reduce((count, dept) => count + (dept.admins?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <div className={`mb-6 transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <Button 
              asChild 
              variant="outline" 
              className="mb-4 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
            >
              <Link to="/programs" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Programs
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-red-600 text-lg font-medium">{error}</p>
            </div>
          ) : currentProgram ? (
            <>
              {/* Header Section */}
              <div className={`text-center mb-12 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
              }`}>
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  {currentProgram.name}
                </h1>
                <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-emerald-500" />
                    <span>{currentProgram.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-teal-500" />
                    <span>{currentProgram.degree}</span>
                  </div>
                </div>
              </div>
              
              {/* Program Details Card */}
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-10 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '200ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Program Information</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-emerald-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Degree</p>
                          <p className="font-medium text-gray-900 dark:text-white">{currentProgram.degree}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-teal-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                          <p className="font-medium text-gray-900 dark:text-white">{currentProgram.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-cyan-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Established</p>
                          <p className="font-medium text-gray-900 dark:text-white">{formatDate(currentProgram.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Building className="w-5 h-5 text-emerald-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
                          <p className="font-medium text-gray-900 dark:text-white">{currentProgram.department?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-teal-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Administrators</p>
                          <p className="font-medium text-gray-900 dark:text-white">{totalAdmins}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Departments Section */}
              <div className={`transform transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '400ms' }}>
                <div className="flex items-center mb-6">
                  <Building className="w-6 h-6 text-emerald-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h2>
                  <Badge variant="outline" className="ml-3">
                    {currentProgram.department?.length || 0}
                  </Badge>
                </div>
                
                {currentProgram.department && currentProgram.department.length > 0 ? (
                  <div className="space-y-8">
                    {currentProgram.department.map((dept) => (
                      <DepartmentSection key={dept._id} department={dept} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Departments</h3>
                    <p className="text-gray-500 dark:text-gray-400">This program doesn't have any departments assigned.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Program not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;