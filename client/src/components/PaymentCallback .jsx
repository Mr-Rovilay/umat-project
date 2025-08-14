import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentCallback  = () => {
    const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract reference from URL query parameters
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');
    const trxref = params.get('trxref');
    
    // Use either reference or trxref as the payment reference
    const paymentReference = reference || trxref;
    
    if (paymentReference) {
      // Redirect to the payment confirmation page
      navigate(`/payments/verify/${paymentReference}`);
    } else {
      // If no reference found, redirect to dashboard
      navigate('/student/dashboard');
    }
  }, [location, navigate]);
  
  return (
    <div className="min-pad-container bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Processing Payment...</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we process your payment</p>
      </div>
    </div>
  );
}

export default PaymentCallback 
