'use client';

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 shadow-2xl border-b-4 border-yellow-400">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-extrabold text-yellow-400 tracking-wider">
              🥊 MMA PROJECT
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-yellow-400 transition-colors duration-300 font-semibold text-lg">
              Home
            </Link>
            <Link href="/fighters" className="text-white hover:text-yellow-400 transition-colors duration-300 font-semibold text-lg">
              Fighters
            </Link>
            <Link href="/rankings" className="text-white hover:text-yellow-400 transition-colors duration-300 font-semibold text-lg">
              Rankings
            </Link>
            <Link href="/about" className="text-white hover:text-yellow-400 transition-colors duration-300 font-semibold text-lg">
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-yellow-400 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
