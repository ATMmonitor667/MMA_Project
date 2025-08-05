'use client';

import React from 'react';
import Link from 'next/link';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-2xl border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-yellow-400 text-2xl font-bold tracking-wide hover:text-yellow-300 transition-colors">
              MMA PROJECT
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/fighters" 
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fighters
              </Link>
              <Link 
                href="/search" 
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Search
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
