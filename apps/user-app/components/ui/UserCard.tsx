// components/UserCard.tsx
interface User {
    user_id: number;
    firstname: string;
    lastname: string;
    onPay?: (user: User) => void;
  }
  
  export default function UserCard({ user, onPay }: { user: User; onPay?: (user: User) => void }) {
    const initials = `${user.firstname?.[0] ?? ''}${user.lastname?.[0] ?? ''}`.toUpperCase();
  
    return (
      <li className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition rounded-md">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div>
            <div className="text-gray-900 font-medium">
              {user.firstname} {user.lastname}
            </div>
          </div>
        </div>
  
        {/* Pay Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => onPay?.(user)}
        >
          Pay
        </button>
      </li>
    );
  }
  