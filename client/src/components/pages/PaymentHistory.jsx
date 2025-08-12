// src/components/PaymentHistory.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  CreditCard, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getPaymentHistory } from '@/redux/slice/paymentSlice';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { paymentHistory, isLoading, error } = useSelector((state) => state.payment);
//   const { user } = useSelector((state) => state.auth);
  
  // Local state
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch payment history on component mount
  useEffect(() => {
    dispatch(getPaymentHistory());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter payments based on search and filters
  useEffect(() => {
    let result = paymentHistory || [];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.reference?.toLowerCase().includes(query) ||
        payment.paymentType?.toLowerCase().includes(query) ||
        payment.semester?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply semester filter
    if (semesterFilter !== 'all') {
      result = result.filter(payment => payment.semester === semesterFilter);
    }
    
    setFilteredPayments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [paymentHistory, searchQuery, statusFilter, semesterFilter]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDownloadReceipt = (payment) => {
    if (payment.paystackData && payment.paystackData.receipt_url) {
      window.open(payment.paystackData.receipt_url, '_blank');
    } else {
      toast.error('Receipt not available for this payment');
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'successful':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">Successful</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200">{status}</Badge>;
    }
  };

  const getPaymentTypeDisplay = (type) => {
    switch (type) {
      case 'school_fees':
        return 'School Fees';
      case 'departmental_dues':
        return 'Departmental Dues';
      case 'hall_dues':
        return 'Hall Dues';
      default:
        return type;
    }
  };

  // Payment details modal
  const PaymentDetailsModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md bg-white dark:bg-gray-800">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">Payment Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(null)}>
              ×
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                <span className="font-medium">{selectedPayment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium">₦{selectedPayment.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Type:</span>
                <span className="font-medium">{getPaymentTypeDisplay(selectedPayment.paymentType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Semester:</span>
                <span className="font-medium">{selectedPayment.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium">{formatDate(selectedPayment.createdAt)}</span>
              </div>
              {selectedPayment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-medium">{selectedPayment.transactionId}</span>
                </div>
              )}
              {selectedPayment.verifiedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Verified At:</span>
                  <span className="font-medium">{formatDate(selectedPayment.verifiedAt)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              {selectedPayment.paystackData?.receipt_url && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                >
                  <Download className="mr-1 h-4 w-4" />
                  Receipt
                </Button>
              )}
              <Button onClick={() => setSelectedPayment(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment History</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View and manage all your payment transactions
              </p>
            </div>
            <Button
              onClick={() => navigate('/student/dashboard')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by reference, type, or semester..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700 rounded-full"
                />
              </div>
              
              {/* Status Filter */}
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Semester Filter */}
              <div className="w-full md:w-48">
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger className="bg-white/50 dark:bg-gray-900/50 border-emerald-200 dark:border-emerald-700">
                    <SelectValue placeholder="Filter by semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="First Semester">First Semester</SelectItem>
                    <SelectItem value="Second Semester">Second Semester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payments found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                {searchQuery || statusFilter !== 'all' || semesterFilter !== 'all'
                  ? 'No payments match your search criteria. Try adjusting your filters.'
                  : 'You haven\'t made any payments yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {filteredPayments.filter(p => p.status === 'successful').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mr-3">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {filteredPayments.filter(p => p.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg mr-3">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {filteredPayments.filter(p => p.status === 'failed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payments Table */}
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Payment Transactions</CardTitle>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Showing {currentItems.length} of {filteredPayments.length} payments
                  </p>
                  {(searchQuery || statusFilter !== 'all' || semesterFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setSemesterFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentItems.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            {payment.reference}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {getPaymentTypeDisplay(payment.paymentType)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                            ₦{payment.amount?.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {payment.semester}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(payment)}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                View
                              </Button>
                              {payment.status === 'successful' && payment.paystackData?.receipt_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(payment)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      <PaymentDetailsModal />
    </div>
  );
};

export default PaymentHistory;