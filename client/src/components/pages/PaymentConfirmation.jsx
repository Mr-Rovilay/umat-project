// src/components/PaymentConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowLeft, Loader2, Download } from 'lucide-react';
import { verifyPayment } from '@/redux/slice/paymentSlice';

const PaymentConfirmation = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { paymentDetails, isLoading, error } = useSelector((state) => state.payment);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (reference) {
        try {
          const result = await dispatch(verifyPayment(reference));
          if (result.meta.requestStatus === 'fulfilled') {
            setPaymentInfo(result.payload.data);
            setVerificationStatus('success');
            toast.success('Payment verified successfully');
          } else {
            setVerificationStatus('failed');
            toast.error('Payment verification failed');
          }
        } catch (error) {
          setVerificationStatus('failed');
          toast.error('Error verifying payment');
        }
      }
    };

    verifyPaymentStatus();
  }, [reference, dispatch]);

  const handleDownloadReceipt = () => {
    if (paymentInfo && paymentInfo.receiptUrl) {
      window.open(paymentInfo.receiptUrl, '_blank');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/student/dashboard');
  };

  const handleGoToPaymentHistory = () => {
    navigate('/student/payments');
  };

  if (isLoading || verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verifying Payment...</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we verify your payment status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-emerald-200 dark:border-emerald-700 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
              {verificationStatus === 'success' ? (
                <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {verificationStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {verificationStatus === 'success' && paymentInfo ? (
              <div className="space-y-6">
                <Alert className="border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your payment has been successfully processed and verified.
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{paymentInfo.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦{paymentInfo.amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {paymentInfo.paymentType === 'departmental_dues' ? 'Departmental Dues' : 'School Fees'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                        {paymentInfo.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{paymentInfo.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(paymentInfo.verifiedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleDownloadReceipt}
                    className="flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToPaymentHistory}
                  >
                    View Payment History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToDashboard}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <Alert className="border-red-200 bg-red-50/50 dark:bg-red-900/20 dark:border-red-800">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    We couldn't verify your payment. Please contact support or try again.
                  </AlertDescription>
                </Alert>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 font-medium">Error Details:</p>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToPaymentHistory}
                  >
                    View Payment History
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGoToDashboard}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentConfirmation;