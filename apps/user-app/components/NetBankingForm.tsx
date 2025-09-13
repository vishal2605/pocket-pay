"use client"
import { useState } from "react";
import NetBankingPaymentDialog from "./ui/NetBankingPaymentDialog";

export default function WalletDepositPage() {
    const [amount, setAmount] = useState(0);
    const [bank, setBank] = useState('');
    const [showBankPopUp, setShowBankPopUp] = useState(false);

    const handleDeposit = ()=> {
        setShowBankPopUp(true);
    }

    const handleCloseDialog = () => {
      setAmount(0);
      setBank('');
      setShowBankPopUp(false);
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Wallet Deposit</h1>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
  
              {/* Form Section */}
              <div className="px-6 py-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Add Money via Net Banking</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Left Column - Deposit Details */}
                  <div>
                    <div className="mb-6">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Deposit Amount
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          name="amount"
                          value={amount}
                          className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter amount"
                          min="100"
                          step="1"
                          onChange={(e) => setAmount(Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">INR</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Minimum deposit: ₹100</p>
                    </div>
  
                    <div className="mb-6">
                      <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Bank
                      </label>
                      <select
                        id="bank"
                        name="bank"
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="block w-full py-3 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Select your bank --</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="BOB">Bank of Baroda</option>
                      </select>
                    </div>
                  </div>
  
                  {/* Right Column - Deposit Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Deposit Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deposit Amount:</span>
                        <span className="text-sm font-medium">₹{amount}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between">
                        <span className="text-base font-medium">Total Deducted:</span>
                        <span className="text-base font-bold">₹{amount}</span>
                      </div>
                    </div>
  
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={handleDeposit}
                        disabled={!amount || !bank}
                        className={`w-full ${!amount || !bank ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                      >
                        Initiate Deposit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {showBankPopUp && (
            <NetBankingPaymentDialog amount={amount} bank={bank} onClose={handleCloseDialog}/>
        )}
      </div>
    );
  }