import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, wallet, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
        location.pathname === to ? 'text-yellow-400' : 'text-gray-300'
      }`}
      onClick={() => setMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-yellow-400 tracking-wider">
          🥊 MMA CARDS
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLink('/', 'Home')}
          {isAuthenticated && (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/collection', 'Collection')}
              {navLink('/store', 'Store')}
              {navLink('/marketplace', 'Marketplace')}
              {navLink('/battle', 'Battle')}
            </>
          )}
          {navLink('/leaderboard', 'Leaderboard')}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && wallet && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-yellow-400 font-bold">🪙 {wallet.coins.toLocaleString()}</span>
              <span className="text-cyan-400 font-bold">💎 {wallet.gems}</span>
            </div>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-300 hover:text-white font-medium">
                👤 {user?.username}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm px-3 py-1 rounded border border-gray-600 hover:border-yellow-400 text-gray-300 hover:text-yellow-400 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-sm px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button type="button" className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 flex flex-col gap-4">
          {navLink('/', 'Home')}
          {isAuthenticated && (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/collection', 'Collection')}
              {navLink('/store', 'Store')}
              {navLink('/marketplace', 'Marketplace')}
              {navLink('/battle', 'Battle')}
            </>
          )}
          {navLink('/leaderboard', 'Leaderboard')}
          {isAuthenticated && wallet && (
            <div className="flex gap-4 text-sm pt-2 border-t border-gray-700">
              <span className="text-yellow-400 font-bold">🪙 {wallet.coins.toLocaleString()}</span>
              <span className="text-cyan-400 font-bold">💎 {wallet.gems}</span>
            </div>
          )}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="text-sm text-red-400 text-left">
              Logout ({user?.username})
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-sm text-yellow-400 font-bold">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
