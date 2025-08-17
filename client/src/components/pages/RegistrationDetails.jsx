// components/RegistrationDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Download,
  Calendar,
  Clock,
  Award,
  Building
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { fetchStudentRegistrationDetails, verifyStudentDocuments } from '@/redux/slice/departmentAdminSlice';
import { clearError } from '@/redux/slice/authSlice';
function RegistrationDetails() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const departmentAdminState = useSelector((state) => state.departmentAdmin);
  const { 
    registrationDetails, 
    isLoading, 
    error, 
    verificationSuccess 
  } = departmentAdminState;
  const [activeTab, setActiveTab] = useState('overview');
  useEffect(() => {
    if (registrationId) {
      dispatch(fetchStudentRegistrationDetails(registrationId));
    }
  }, [dispatch, registrationId]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  useEffect(() => {
    if (verificationSuccess) {
      toast.success('Document verification updated successfully');
      // Refresh the data
      dispatch(fetchStudentRegistrationDetails(registrationId));
    }
  }, [verificationSuccess, dispatch, registrationId]);
  const handleVerifyDocument = (documentType, verified) => {
    dispatch(verifyStudentDocuments({
      registrationId,
      documentType,
      verified: !verified
    }));
  };
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  // Helper function to get department names
// components/RegistrationDetails.jsx
// Helper function to get department names
const getDepartmentNames = (departments) => {
  if (!departments) return 'N/A';
  
  // If it's an array
  if (Array.isArray(departments)) {
    if (departments.length === 0) return 'N/A';
    
    // Handle array of objects (with _id and name)
    if (typeof departments[0] === 'object' && departments[0] !== null) {
      return departments.map(dept => dept.name || dept._id || dept).filter(Boolean).join(', ');
    }
    
    // Handle array of strings (IDs)
    return departments.filter(Boolean).join(', ');
  }
  
  // Handle single object (with _id and name)
  if (typeof departments === 'object' && departments !== null) {
    return departments.name || departments._id || 'N/A';
  }
  
  // Handle single string (ID)
  return departments;
};
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading registration details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!registrationDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Registration Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The registration you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={handleGoBack}>Back to Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Calculate registration completion status
  const allVerified = 
    registrationDetails.uploads?.courseRegistrationSlip?.verified && 
    registrationDetails.uploads?.schoolFeesReceipt?.verified && 
    registrationDetails.uploads?.hallDuesReceipt?.verified;
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-pad-container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Registration Details</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {registrationDetails.student?.firstName} {registrationDetails.student?.lastName} - {registrationDetails.program?.name}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {allVerified ? (
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" /> Registration Complete
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" /> Registration Incomplete
                </Badge>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Payments
            </button>
          </nav>
        </div>
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-emerald-600" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.firstName} {registrationDetails.student?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Student ID:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.referenceNumber || registrationDetails.student?._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Level:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.level || registrationDetails.level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Registered:</span>
                      <span className="font-medium">
                        {registrationDetails.student?.isRegistered ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-emerald-600" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Program:</span>
                      <span className="font-medium">
                        {registrationDetails.program?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Degree:</span>
                      <span className="font-medium">
                        {registrationDetails.program?.degree}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Department:</span>
                      <span className="font-medium">
                        {getDepartmentNames(registrationDetails.student?.department)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Level:</span>
                      <span className="font-medium">
                        {registrationDetails.level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Semester:</span>
                      <span className="font-medium">
                        {registrationDetails.semester}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Registration Date:</span>
                      <span className="font-medium">
                        {new Date(registrationDetails.registrationDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(registrationDetails.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Registration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-emerald-600" />
                    Registration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Overall Status:</span>
                      {allVerified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" /> Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" /> Incomplete
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Registration Slip:</span>
                        {registrationDetails.uploads?.courseRegistrationSlip?.verified ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Not Verified</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Fees Receipt:</span>
                        {registrationDetails.uploads?.schoolFeesReceipt?.verified ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Not Verified</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Hall Dues:</span>
                        {registrationDetails.uploads?.hallDuesReceipt?.verified ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Not Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                    Payment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Payment Status:</span>
                      <span className="font-medium">
                        {registrationDetails.paymentStatus === 'complete' ? (
                          <Badge className="bg-green-100 text-green-800">Complete</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        )}
                      </span>
                    </div>
                    {registrationDetails.payments && registrationDetails.payments.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Payment Type:</span>
                          <span className="font-medium">
                            {registrationDetails.payments[0].paymentType?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                          <span className="font-medium">
                            ₦{registrationDetails.payments[0].amount?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Reference:</span>
                          <span className="font-medium">
                            {registrationDetails.payments[0].reference}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Registration Slip */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                    Registration Slip
                  </CardTitle>
                  <CardDescription>
                    Course registration slip document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {registrationDetails.uploads?.courseRegistrationSlip?.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" /> Not Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Uploaded:</span>
                      <span>
                        {registrationDetails.uploads?.courseRegistrationSlip?.uploadedAt 
                          ? new Date(registrationDetails.uploads.courseRegistrationSlip.uploadedAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {registrationDetails.uploads?.courseRegistrationSlip?.url && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(registrationDetails.uploads.courseRegistrationSlip.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" /> View Document
                        </Button>
                      )}
                      
                      {!registrationDetails.uploads?.courseRegistrationSlip?.verified && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleVerifyDocument('courseRegistrationSlip', false)}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify Document
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Fees Receipt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                    Fees Receipt
                  </CardTitle>
                  <CardDescription>
                    School fees payment receipt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {registrationDetails.uploads?.schoolFeesReceipt?.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" /> Not Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Uploaded:</span>
                      <span>
                        {registrationDetails.uploads?.schoolFeesReceipt?.uploadedAt 
                          ? new Date(registrationDetails.uploads.schoolFeesReceipt.uploadedAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {registrationDetails.uploads?.schoolFeesReceipt?.url && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(registrationDetails.uploads.schoolFeesReceipt.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" /> View Document
                        </Button>
                      )}
                      
                      {!registrationDetails.uploads?.schoolFeesReceipt?.verified && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleVerifyDocument('schoolFeesReceipt', false)}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify Document
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Hall Dues Receipt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                    Hall Dues Receipt
                  </CardTitle>
                  <CardDescription>
                    Hall accommodation dues receipt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      {registrationDetails.uploads?.hallDuesReceipt?.verified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" /> Not Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Uploaded:</span>
                      <span>
                        {registrationDetails.uploads?.hallDuesReceipt?.uploadedAt 
                          ? new Date(registrationDetails.uploads.hallDuesReceipt.uploadedAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {registrationDetails.uploads?.hallDuesReceipt?.url && (
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(registrationDetails.uploads.hallDuesReceipt.url, '_blank')}
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" /> View Document
                        </Button>
                      )}
                      
                      {!registrationDetails.uploads?.hallDuesReceipt?.verified && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleVerifyDocument('hallDuesReceipt', false)}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify Document
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  Payment records for this registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {registrationDetails.payments && registrationDetails.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Reference
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {registrationDetails.payments.map((payment, index) => (
                          <tr key={payment._id || index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {payment.paymentType?.replace('_', ' ') || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              ₦{payment.amount?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {payment.status === 'successful' ? (
                                <Badge className="bg-green-100 text-green-800">Successful</Badge>
                              ) : payment.status === 'pending' ? (
                                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Failed</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {payment.reference || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {payment.receiptUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(payment.receiptUrl, '_blank')}
                                >
                                  <Download className="h-4 w-4 mr-1" /> Receipt
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No payment records found.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Payment Status: {registrationDetails.paymentStatus === 'complete' ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default RegistrationDetails;