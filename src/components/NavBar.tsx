"use client";
import Link from 'next/link';
import Image from 'next/image';
import LocationSelector from './LocationSelector';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const LoginDialog = dynamic(() => import('./LoginDialog'), { ssr: false });

export default function NavBar() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="CrozHere Logo"
            width={48}
            height={48}
            className="rounded-full"
            priority
          />
          <span className="text-2xl font-bold text-blue-600">CrozHere</span>
        </div>
        <div className="flex items-center space-x-4">
          <LocationSelector />
          <button
            className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={() => setLoginOpen(true)}
          >
            Login / Register
          </button>
        </div>
      </div>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </nav>
  );
} 