'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const onSignin = () => signIn();
  const onSignout = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  };

  return (
    <div className="flex justify-between p-3 border-b border-slate-200 relative">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Pocket<span className="text-blue-600 ml-1">Pay</span>
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
                <path
                  d="M12 12c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 2c-2.67 0-8 1.336-8 4v2h16v-2c0-2.664-5.33-4-8-4z"
                  fill="#9CA3AF"
                />
              </svg>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/profile');
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={onSignout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onSignin}>Login</button>
        )}
      </div>
    </div>
  );
}
