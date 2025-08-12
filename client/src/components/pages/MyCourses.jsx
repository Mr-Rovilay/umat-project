import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Hash,
  Calendar,
  Loader2,
  AlertCircle,
  GraduationCap,
  Clock,
  DollarSign,
  FileText,
} from 'lucide-react';
import { clearError, fetchMyCourses } from '@/redux/slice/courseSlice';

function MyCourses() {
  const dispatch = useDispatch();
  const { myCourses, isLoading, error, owingStatus, payments } = useSelector((state) => state.courses);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchMyCourses());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
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
            View your registered courses and payment status for the current semester
          </p>
        </div>

        {/* Owing Status and Register Button */}
        <div className="mb-8">
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="flex flex-col md:flex-row items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Owing Status: {owingStatus === undefined || owingStatus ? (
                    <span className="text-red-600 dark:text-red-400">Pending Payment</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">Cleared</span>
                  )}
                </span>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white mt-4 md:mt-0"
              >
                <Link to="/courses/register">Register Now (Courses)</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200 flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-200 dark:hover:bg-red-900/30"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Content */}
        {!Array.isArray(myCourses) || myCourses.length === 0 ? (
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Courses Found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                You haven't registered for any courses yet. Please visit the course registration page to enroll.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Link to="/courses/register">Register Courses</Link>
              </Button>
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
                      {registration.program?.name || 'Unknown Program'} ({registration.program?.degree || 'N/A'})
                    </CardTitle>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                        <Hash className="h-3 w-3" />
                        Level {registration.level || 'N/A'}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                        <Calendar className="h-3 w-3" />
                        {registration.semester || 'N/A'}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 border-emerald-200 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                        <Clock className="h-3 w-3" />
                        Registered {registration.createdAt ? format(parseISO(registration.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-emerald-700 dark:text-emerald-300">
                    {registration.courses?.length || 0} course{registration.courses?.length !== 1 ? 's' : ''} registered • Total {registration.courses?.reduce((sum, course) => sum + (course.unit || 0), 0) || 0} units
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Documents Status */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Document Status</h4>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.isArray(registration.documents) && registration.documents.length > 0 ? (
                        registration.documents.map((doc) => (
                          <div key={doc._id} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{doc.type}</span>
                            <Badge
                              variant={doc.verified ? 'success' : 'warning'}
                              className={doc.verified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}
                            >
                              {doc.verified ? 'Verified' : 'Pending'}
                            </Badge>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View
                            </a>
                          </div>
                        ))
                      ) : registration.uploads ? (
                        [
                          { type: 'CourseRegistrationSlip', ...registration.uploads.courseSlip },
                          { type: 'SchoolFeesReceipt', ...registration.uploads.schoolFeesReceipt },
                          { type: 'DepartmentalDuesReceipt', ...registration.uploads.departmentalDuesReceipt },
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">{doc.type}</span>
                            <Badge
                              variant={doc.verified ? 'success' : 'warning'}
                              className={doc.verified ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}
                            >
                              {doc.verified ? 'Verified' : 'Pending'}
                            </Badge>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No documents uploaded</p>
                      )}
                    </div>
                  </div>
                  {/* Course List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(registration.courses) && registration.courses.length > 0 ? (
                      registration.courses.map((course) => (
                        <div key={course._id} className="p-4 border border-emerald-100 dark:border-emerald-900/50 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{course.title || 'N/A'}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{course.code || 'N/A'}</p>
                            </div>
                            <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                              {course.unit || 0} unit{course.unit !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{course.semester || 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">No courses registered</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Payment History */}
            {Array.isArray(payments) && payments.length > 0 ? (
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-emerald-800 dark:text-emerald-200">
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-3 border border-emerald-100 dark:border-emerald-900/50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {payment.type} ({payment.semester})
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Amount: ${payment.amount} • {format(parseISO(payment.createdAt), 'MMM d, yyyy')}
                          </p>
                          {payment.transactionId && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Transaction ID: {payment.transactionId}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'destructive'}
                          className={payment.status === 'completed' ? 'bg-green-600 text-white' : payment.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardContent className="py-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">No payment history available</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;