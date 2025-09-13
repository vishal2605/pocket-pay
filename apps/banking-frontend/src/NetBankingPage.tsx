import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NetBankingPage() {
  const {token} = useParams<{token: string}>();
  const [customerId, setCustomerId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [proceeding, setProceeding] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  // Fetch payment details on component mount

    useEffect(() => {
      const fetchPaymentDetails = async () => {
        try {
          console.log('env ',import.meta.env.VITE_MAINPROJECTBACKEND);
          const response = await axios.get(
            `${import.meta.env.VITE_MAINPROJECTBACKEND}/api/user/processing/${token}`
          );
          console.log(response);
          setBank(response.data.bank);
          setAmount(response.data.amount);
          setUserId(response.data.userId);
          const status = response?.data?.status;
          if (status === 'Success') {
            setPaymentSuccess(true);
          } else if (status === 'Failed') {
            setApiError("Transaction failed");
          }
        } catch (error: any) {
          if (error.response) {
            setApiError(error.response.data.message || 'Failed to fetch payment details');
          } else {
            setApiError('Network error. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchPaymentDetails();
    }, [token]);

  const handleProceed = async () => {
    if (!customerId.trim()) {
      setError('Customer ID is required');
      return;
    }

    setError('');
    setProceeding(true);

    try {
      // Call your webhook API to confirm payment
      const response = await fetch(`${import.meta.env.VITE_WEBHOOK_SERVER_URL}/hdfcWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token:token,
          amount:amount,
          user_id:userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentSuccess(true);
      } else {
        setError(data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setProceeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{apiError}</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">₹{amount} has been paid from {bank}.</p>
          <p className="text-sm text-gray-500">Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Pay ₹{amount} from {bank}</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">₹{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bank:</span>
            <span className="font-medium">{bank}</span>
          </div>
        </div>

        <label className="block text-left text-sm font-medium text-gray-700 mb-2">
          Customer ID
        </label>
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your Customer ID"
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <button
          onClick={handleProceed}
          disabled={proceeding}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200 disabled:opacity-60"
        >
          {proceeding ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );
}