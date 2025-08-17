import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { verifyPayment } from '@/redux/slice/paymentSlice';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, paymentVerification } = useSelector((state) => state.payment);
  const [reference, setReference] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'failed', or null
  
  useEffect(() => {
    // Get the reference from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const ref = urlParams.get('reference');
    const trxref = urlParams.get('trxref'); // Paystack sometimes uses trxref
    
    const paymentReference = ref || trxref;
    setReference(paymentReference);
    
    if (paymentReference) {
      console.log('Verifying payment with reference:', paymentReference);
      dispatch(verifyPayment(paymentReference))
        .unwrap()
        .then((result) => {
          console.log('Verification successful:', result);
          setVerificationStatus('success');
        })
        .catch((err) => {
          console.error('Verification failed:', err);
          setVerificationStatus('failed');
        });
    } else {
      console.error('No payment reference found in URL');
      setVerificationStatus('failed');
    }
  }, [dispatch, location.search]);
  
  useEffect(() => {
    if (verificationStatus === 'success') {
      // After verification is complete, redirect to dashboard
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, navigate]);
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Payment Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Verifying your payment...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reference: {reference}
                </p>
              </div>
            ) : verificationStatus === 'failed' || error ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-xl font-medium text-red-600 dark:text-red-400">
                  Payment Verification Failed
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {error || 'There was an error verifying your payment. Please try again.'}
                </p>
                {!reference && (
                  <p className="text-sm text-red-500">
                    No payment reference found in the URL
                  </p>
                )}
                <Button onClick={handleGoToDashboard} className="mt-4">
                  Go to Dashboard
                </Button>
              </div>
            ) : verificationStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <p className="text-xl font-medium text-green-600 dark:text-green-400">
                  Payment Verified Successfully
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Thank you for your payment! Your account has been updated.
                  You will be redirected to your dashboard shortly.
                </p>
                {paymentVerification && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
                    <p className="text-sm font-medium">Payment Details:</p>
                    <p className="text-sm">Amount: {paymentVerification.payment?.amount}</p>
                    <p className="text-sm">Type: {paymentVerification.payment?.type}</p>
                    <p className="text-sm">Reference: {paymentVerification.payment?.reference}</p>
                  </div>
                )}
                <div className="mt-6">
                  <Button 
                    onClick={handleGoToDashboard} 
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Initializing payment verification...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCallback;