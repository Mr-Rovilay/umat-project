import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  User,
  Mail,
  Phone,
  Hash,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  LogOut,
  Key,
  ArrowRight,
  Newspaper,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { clearError, getUser, updateUser, changePassword,logoutUser } from '@/redux/slice/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [updateProfileForm, setUpdateProfileForm] = useState({ email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUpdateProfileForm({ email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dispatch(changePassword(changePasswordForm));
      if (changePassword.fulfilled.match(result)) {
        toast.success('Password changed successfully');
        setChangePasswordForm({ currentPassword: '', newPassword: '' });
        setAccountDialogOpen(false);
      } else {
        toast.error(result.payload || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dispatch(updateUser(updateProfileForm));
      if (updateUser.fulfilled.match(result)) {
        toast.success('Profile updated successfully');
        setAccountDialogOpen(false);
      } else {
        toast.error(result.payload || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(result)) {
        toast.success('Logged out successfully');
        navigate('/login');
      } else {
        toast.error(result.payload || 'Failed to logout');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const calculateOwingStatus = () => {
    if (!user?.paymentHistory || user.paymentHistory.length === 0) {
      return { isOwing: true, amount: 'Unknown' };
    }
    const totalPaid = user.paymentHistory.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const requiredAmount = 100000; // Example: Assume 100,000 is required (adjust based on your logic)
    return {
      isOwing: totalPaid < requiredAmount,
      amount: requiredAmount - totalPaid > 0 ? requiredAmount - totalPaid : 0,
    };
  };

  const owingStatus = calculateOwingStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg mb-6 animate-fade-in-down">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 animate-fade-in-down">
            Welcome, {user?.firstName || 'Student'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto animate-fade-in-up">
            Manage your academic journey and stay updated
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Account Management */}
        <div className="flex justify-end mb-6">
          <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-emerald-200 dark:border-emerald-700">
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Update Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <h3 className="text-lg font-semibold">Update Profile</h3>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={updateProfileForm.email}
                      onChange={(e) => setUpdateProfileForm({ ...updateProfileForm, email: e.target.value })}
                      placeholder="Enter new email"
                      className="bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={updateProfileForm.phone}
                      onChange={(e) => setUpdateProfileForm({ ...updateProfileForm, phone: e.target.value })}
                      placeholder="Enter new phone number"
                      className="bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={changePasswordForm.currentPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={changePasswordForm.newPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="bg-white/50 dark:bg-gray-900/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </form>

                {/* Logout */}
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dashboard Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-emerald-600" />
                Course Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Register for your courses for the current semester.
              </p>
              <Button
                onClick={() => navigate('/courses/register')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Register Now (Courses)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Newspaper className="mr-2 h-5 w-5 text-emerald-600" />
                Departmental News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Stay updated with news from your department.
              </p>
              <Button
                onClick={() => navigate(`/news?department=${user?.department?.[0]?._id || ''}`)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={!user?.department?.[0]?._id}
              >
                View News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-2xl flex items-center text-emerald-800 dark:text-emerald-200">
                <User className="mr-2 h-6 w-6" />
                {user?.firstName || 'Unknown'} {user?.lastName || 'User'}
              </CardTitle>
              <div className="flex gap-3">
                <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  <Hash className="h-3 w-3" />
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
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
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${
                    owingStatus.isOwing
                      ? 'border-red-200 text-red-700 dark:border-red-700 dark:text-red-300'
                      : 'border-green-200 text-green-700 dark:border-green-700 dark:text-green-300'
                  }`}
                >
                  {owingStatus.isOwing ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  {owingStatus.isOwing ? `Owing ${owingStatus.amount}` : 'No Dues'}
                </Badge>
              </div>
            </div>
            <CardDescription className="text-emerald-700 dark:text-emerald-300 mt-2">
              Reference Number: {user?.referenceNumber || 'N/A'}
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
                    <span className="text-gray-700 dark:text-gray-300">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Hash className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">Reference: {user?.referenceNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-gray-700 dark:text-gray-300">Role: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-gray-700 dark:text-gray-300">Program:</span>
                    </div>
                    {user?.program && user.program.length > 0 ? (
                      <div className="ml-8 space-y-2">
                        {(Array.isArray(user.program) ? user.program : [user.program]).map((prog, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {prog?.name || prog || 'Unknown Program'}
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
                    {user?.department && user.department.length > 0 ? (
                      <div className="ml-8 space-y-2">
                        {user.department.map((dept, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {dept?.name || dept || 'Unknown Department'}
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

export default Profile