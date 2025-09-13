"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DollarSign, Repeat, ArrowUpRight, ArrowDownLeft, Wallet, History, Loader2 } from 'lucide-react';

interface OnRampTransaction {
  id: number;
  status: string;
  token: string;
  provider: string;
  amount: number;
  startTime: string;
}

interface WalletTransaction {
  id: number;
  type: string; 
  amount: number;
  fromUserId?: number;
  toUserId?: number;
  fromUser?: { firstname: string; lastname: string };
  toUser?: { firstname: string; lastname: string };
  status: string;
  timestamp: string;
  notes?: string;
}

export default function TransactionHistory() {
  const { data: session } = useSession();
  const [onRampTransactions, setOnRampTransactions] = useState<OnRampTransaction[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      const userId = session?.user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/user/transaction/${userId}`);
        setOnRampTransactions(response.data.onRampTransactions || []);
        setWalletTransactions(response.data.walletTransactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
        setError("Failed to fetch transaction history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; text: string }> = {
      SUCCESS: { class: "bg-green-100 text-green-800", text: "COMPLETED" },
      FAILED: { class: "bg-red-100 text-red-800", text: "FAILED" },
      PROCESSING: { class: "bg-yellow-100 text-yellow-800", text: "PROCESSING" },
      REVERSED: { class: "bg-orange-100 text-orange-800", text: "REVERSED" },
    };

    const statusConfig = statusMap[status.toUpperCase()] || { class: "bg-gray-100 text-gray-800", text: status.toUpperCase() };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.class}`}>
        {statusConfig.text}
      </span>
    );
  };

  const getTransactionDetails = (txn: WalletTransaction, userId?: number) => {
    const isOutgoing = txn.fromUserId === userId;
    const isIncoming = txn.toUserId === userId;
  
    const icon = isOutgoing ? (
      <ArrowUpRight className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
    ) : (
      <ArrowDownLeft className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
    );
  
    const amountDisplay = (
      <span className={isOutgoing ? "text-red-600" : "text-green-600"}>
        {isOutgoing ? "-" : "+"} ₹{txn.amount}
      </span>
    );
  
    let description = txn.notes || "User-to-user transfer";
    let typeLabel = txn.type;
  
    if (txn.type === "TRANSFER") {
      typeLabel = isOutgoing ? "SENT" : "RECEIVED";
    }
  
    return {
      icon,
      amountDisplay,
      description,
      typeLabel,
    };
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <span className="ml-3 text-lg text-gray-700">Loading transactions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white p-6">
        <p className="text-center text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 bg-white">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-600 flex items-center">
        <History className="w-8 h-8 mr-3" /> Transaction History
      </h2>

      {(!onRampTransactions.length && !walletTransactions.length) ? (
        <div className="text-center p-10 bg-white">
          <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-700">No transactions found yet.</p>
          <p className="text-gray-500 mt-2">Start by adding funds or making a transfer!</p>
        </div>
      ) : (
        <div className="space-y-6 w-full">
          {onRampTransactions.length > 0 && (
            <div className="w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-500" /> Deposits
              </h3>
              <ul className="space-y-3 w-full">
                {onRampTransactions.map(txn => (
                  <li key={txn.id} className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <ArrowDownLeft className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-lg text-gray-900">
                          <span className="text-green-600">+ ₹{txn.amount}</span>
                        </div>
                        <div className="text-sm text-gray-600">{txn.provider}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(txn.startTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(txn.status)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {walletTransactions.length > 0 && (
            <div className="w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Repeat className="w-6 h-6 mr-2 text-purple-500" /> Transactions
              </h3>
              <ul className="space-y-3 w-full">
                {walletTransactions.map(txn => {
                  const details = getTransactionDetails(txn, session?.user?.id);
                  return (
                    <li key={txn.id} className="w-full p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center">
                        {details.icon}
                        <div>
                          <div className="font-semibold text-lg text-gray-900">
                            {details.amountDisplay}
                            <span className="ml-2 text-base font-normal text-gray-700">({details.typeLabel})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {details.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(txn.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(txn.status)}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}