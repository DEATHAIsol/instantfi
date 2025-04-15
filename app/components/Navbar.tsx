'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [wallet, setWallet] = useState<any>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      try {
        const response = await (window as any).solana.connect();
        setWallet(response.publicKey.toString());
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install Phantom wallet!');
    }
  };

  return (
    <nav className="bg-[#1B1E27] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-white">InstantFi</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/markets" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Markets
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 