import React, { useEffect, useState } from 'react';
import { Wallet, Banknote, Landmark, ScanText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function WithdrawForm(){
  const [amount, setAmount] = useState('');
  const [recipientType, setRecipientType] = useState('bank'); 
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [balance, setBalance] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch(`/api/user/balance/${session?.user?.id}`);
      const data = await response.json();
      setBalance(data.amount);
    };
    fetchBalance();
  }, [session?.user?.id]);

  // Function to validate form
  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setStatusMessage('Please enter a valid amount.');
      setIsSuccess(false);
      return false;
    }

    if (parseFloat(amount) > balance) {
      setStatusMessage('Insufficient balance for this withdrawal.');
      setIsSuccess(false);
      return false;
    }

    if (recipientType === 'bank') {
      if (!bankAccountNumber || !ifscCode) {
        setStatusMessage('Please enter bank account number and IFSC code.');
        setIsSuccess(false);
        return false;
      }
    } else if (recipientType === 'upi') {
      if (!upiId) {
        setStatusMessage('Please enter UPI ID.');
        setIsSuccess(false);
        return false;
      }
    }

    return true;
  };

  // Function to show confirmation dialog
  const handleWithdrawalClick = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  // Function to handle withdrawal submission
  const handleWithdrawal = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    setStatusMessage('');
    setIsSuccess(false);

    try {
      const userId = session?.user?.id;
      const response = await fetch(`/api/user/withdraw/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(amount), bankAccountNumber: bankAccountNumber, ifscCode: ifscCode }),
      });

      const data = await response.json(); 
      if (response.ok) {
        setStatusMessage(`Withdrawal of ₹${parseFloat(amount).toFixed(2)} successful!`);
        setIsSuccess(true);
        
        if (data?.newBalance !== undefined) {
          setBalance(data.newBalance.toString());
        }
        setAmount('');
        setBankAccountNumber('');
        setIfscCode('');
        setUpiId('');
      } else {
        setStatusMessage('Withdrawal failed. Please try again later.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setStatusMessage('An unexpected error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl transform transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Withdraw Funds</h1>
        </div>

        <div className="flex items-center justify-center mb-6 text-sm text-gray-600">
          <span className="font-semibold">Total Balance:</span>
          <span className="ml-2 text-xl font-bold text-indigo-600">₹{balance}</span>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label htmlFor="amount" className="block text-gray-700 text-sm font-semibold mb-2">
            Amount to Withdraw (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
            <input
              type="number"
              id="amount"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900"
              placeholder="e.g., 500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Recipient Type Selection */}
        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Withdraw To
          </label>
          <div className="flex space-x-4">
            <button
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 transition duration-200 ${
                recipientType === 'bank'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => setRecipientType('bank')}
              disabled={isLoading}
            >
              <Landmark className="h-5 w-5 mr-2" /> Bank Account
            </button>
            <button
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 transition duration-200 ${
                recipientType === 'upi'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={() => setRecipientType('upi')}
              disabled={isLoading}
            >
              <ScanText className="h-5 w-5 mr-2" /> UPI ID
            </button>
          </div>
        </div>

        {/* Conditional Recipient Details */}
        {recipientType === 'bank' && (
          <>
            <div className="mb-5">
              <label htmlFor="bankAccountNumber" className="block text-gray-700 text-sm font-semibold mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                id="bankAccountNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900"
                placeholder="e.g., 1234567890"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="ifscCode" className="block text-gray-700 text-sm font-semibold mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900"
                placeholder="e.g., SBIN0000001"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        {recipientType === 'upi' && (
          <div className="mb-5">
            <label htmlFor="upiId" className="block text-gray-700 text-sm font-semibold mb-2">
              UPI ID
            </label>
            <input
              type="text"
              id="upiId"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900"
              placeholder="e.g., yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Withdrawal Button */}
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleWithdrawalClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Processing...
            </>
          ) : (
            <>
              <Banknote className="h-5 w-5 mr-2" /> Withdraw Now
            </>
          )}
        </button>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-6 p-4 rounded-lg flex items-center ${
              isSuccess === true
                ? 'bg-green-100 text-green-800 border border-green-300'
                : isSuccess === false
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}
          >
            {isSuccess === true && <CheckCircle className="h-5 w-5 mr-2" />}
            {isSuccess === false && <XCircle className="h-5 w-5 mr-2" />}
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Withdrawal</h2>
              <p className="mb-4 text-gray-600">
                You are about to withdraw <span className="font-bold">₹{parseFloat(amount).toFixed(2)}</span> to{' '}
                {recipientType === 'bank' ? (
                  <>
                    bank account ending with <span className="font-bold">{bankAccountNumber.slice(-4)}</span>
                  </>
                ) : (
                  <>
                    UPI ID <span className="font-bold">{upiId}</span>
                  </>
                )}.
              </p>
              <p className="mb-6 text-gray-600">Are you sure you want to proceed?</p>
              <div className="flex space-x-4">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                  onClick={handleWithdrawal}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};