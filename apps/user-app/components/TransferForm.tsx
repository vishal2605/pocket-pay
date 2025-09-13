import { useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from './ui/UserCard';
import PaymentDialog from './ui/PaymentDialog';
import { useSession } from "next-auth/react";

interface User {
  user_id: number;
  firstname: string;
  lastname: string;
}

export const TransferForm = () => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAllUsers() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/user/allUsers`);
        setUsers(response.data.userResponse || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    getAllUsers();
  }, []);

  const handlePaymentClick = (user:User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  const handlePaymentSubmit = async (amount: number, pin: string) => {
    if (!selectedUser) {
      console.warn("No user selected for payment");
      return;
    }
  
    if (!userId) {
      console.error("Current user ID not found");
      return;
    }
  
    try {
      console.log("Sending payment to:", selectedUser, "Amount:", amount, "PIN:", pin);
  
      const response = await axios.post(`/api/user/transfer/${userId}`, {
        to: selectedUser.user_id,
        amount
      });
  
      if (response.status === 200) {
        console.log("Transfer successful");
        setIsDialogOpen(false);
        setSelectedUser(null);
        alert("Transfer successful!");
      } else {
        console.error("Transfer failed:", response.data.message || "Unknown error");
        alert("Transfer failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error during transfer:", error);
      alert("Transfer failed: " + (error.response?.data?.message || error.message || "Unexpected error"));
    }
  };
  

  const filteredUsers = users.filter(user =>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg overflow-hidden w-full">
        <div className="px-6 py-6">
          <div className="mb-6 w-full">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              className="block w-full py-3 px-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-500 py-4">
              {searchTerm ? 'No matching users found' : 'No users available'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map(user => (<UserCard key={user.user_id} user={user} onPay={handlePaymentClick} />))}
            </ul>
          )}
        </div>
        {selectedUser && (
        <PaymentDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handlePaymentSubmit}
          userName={`${selectedUser.firstname} ${selectedUser.lastname}`}
        />
      )}
      </div>
    </div>
  );
};
