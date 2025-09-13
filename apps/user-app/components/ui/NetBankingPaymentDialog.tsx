'use client'
import { useRecoilState } from "recoil";
import { userState } from "../../app/store/atoms/UserState";
import { useSession } from "next-auth/react";


export default function NetBankingPaymentDialog({ amount, bank, onClose }: { amount: number; bank: string; onClose: () => void }) {
    
  const { data: session } = useSession();

  const handlePayment = async () => {
    const userId = session?.user?.id;
    console.log(userId);
    if (!userId) {
      console.error('User ID not available');
      return;
    }

    try {
      const response = await fetch(`/api/user/initiatePayment/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, bankName:bank }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log('Payment initiated:', data);

        const bankingURL = process.env.NEXT_PUBLIC_BANKING_FRONTEND_URL;
        if (!bankingURL) {
          console.error('Banking frontend URL not set in env');
          return;
        }
        onClose();
        window.open(`${bankingURL}/netbanking/${data.data.token}`, '_blank');
      } else {
        console.error('Failed to initiate payment');
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
    }
  };
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" aria-hidden="true"></div>
          
          {/* Dialog container */}
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Header */}
            <div className="bg-blue-600 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-6 text-white">
                  Net Banking Payment
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md text-blue-200 hover:text-white focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Body */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <p className="text-gray-600">Amount to pay:</p>
                  <p className="text-xl font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <p className="text-gray-600">Selected Bank:</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-blue-600">{bank.substring(0, 2)}</span>
                    </div>
                    <p className="font-medium text-gray-900">{bank}</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You will be redirected to your bank's secure payment page to complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                onClick={handlePayment}
              >
                Proceed to Payment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }