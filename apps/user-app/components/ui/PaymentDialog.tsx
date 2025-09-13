import { useState } from "react";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (amount: number, pin: string) => void;
  userName: string;
}

export default function PaymentDialog({ open, onClose, onSubmit, userName }: PaymentDialogProps) {
  const [amount, setAmount] = useState(0);
  const [pin, setPin] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Pay {userName}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter 4-digit PIN"
            maxLength={4}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onSubmit(amount, pin)}
            disabled={!amount || !pin}
          >
            Confirm Pay
          </button>
        </div>
      </div>
    </div>
  );
}
