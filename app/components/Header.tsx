'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[#1B1E27] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              InstantFi
            </Link>
            <nav className="ml-10 flex items-center space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/markets" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/markets' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Markets
              </Link>
            </nav>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).solana) {
                (window as any).solana.connect();
              } else {
                alert('Please install Phantom wallet!');
              }
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
} 