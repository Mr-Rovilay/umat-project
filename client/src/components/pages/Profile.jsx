import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User,
  Mail,
  Phone,
  Hash,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { clearError, getUser } from '@/redux/slice/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            View your personal information and account details
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

        {/* Profile Card */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-2xl flex items-center text-emerald-800 dark:text-emerald-200">
                <User className="mr-2 h-6 w-6" />
                {user?.firstName} {user?.lastName}
              </CardTitle>
              <div className="flex gap-3">
                <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  <Hash className="h-3 w-3" />
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    user?.isOnline 
                      ? 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300' 
                      : 'border-red-200 text-red-700 dark:border-red-700 dark:text-red-300'
                  }`}
                >
                  {user?.isOnline ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {user?.isOnline ? 'Online' : 'Offline'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    user?.isRegistered 
                      ? 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300' 
                      : 'border-red-200 text-red-700 dark:border-red-700 dark:text-red-300'
                  }`}
                >
                  {user?.isRegistered ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {user?.isRegistered ? 'Registered' : 'Not Registered'}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-emerald-700 dark:text-emerald-300 mt-2">
              Reference Number: {user?.referenceNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">Reference: {user?.referenceNumber}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">Role: {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-gray-700 dark:text-gray-300">Programs:</span>
                    </div>
                    {user?.program?.length > 0 ? (
                      <div className="ml-8 space-y-2">
                        {user.program.map((prog, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {prog.name || prog}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="ml-8 text-gray-500 dark:text-gray-400">No programs assigned</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-gray-700 dark:text-gray-300">Department:</span>
                    </div>
                    {user?.department?.length > 0 ? (
                      <div className="ml-8 space-y-2">
                        {user.department.map((dept, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {dept.name || dept}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="ml-8 text-gray-500 dark:text-gray-400">No departments assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;