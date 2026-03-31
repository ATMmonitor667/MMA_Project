import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '🏠' },
  { to: '/collection',   label: 'Collection',   icon: '🃏' },
  { to: '/store',        label: 'Store',        icon: '📦' },
  { to: '/marketplace',  label: 'Market',       icon: '🔄' },
  { to: '/battle',       label: 'Battle',       icon: '⚔'  },
  { to: '/leaderboard',  label: 'Ranks',        icon: '📊' },
  { to: '/achievements', label: 'Achievements', icon: '🏆' },
];

export default function Navbar() {
  const { user, wallet, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (to: string) => location.pathname === to;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5"
      style={{ background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(20px)' }}>

      {/* Top accent line */}
      <div className="h-px w-full"
        style={{ background: 'linear-gradient(90deg,transparent,#f59e0b,#ef4444,#f59e0b,transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🥊</span>
          <span className="font-black text-base tracking-widest text-gradient-gold hidden sm:block">
            MMA CARDS
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {(isAuthenticated ? navLinks : [navLinks[5]]).map(({ to, label, icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${isActive(to)
                  ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && wallet && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <span className="text-base">🪙</span>
                <span className="text-yellow-400 font-black text-sm tabular-nums">{wallet.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-base">💎</span>
                <span className="text-cyan-400 font-black text-sm tabular-nums">{wallet.gems}</span>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-black"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300 hidden sm:block">{user?.username}</span>
              </Link>
              <button type="button" onClick={handleLogout}
                title="Logout"
              className="px-3 py-1.5 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors border border-red-500/20">
                Exit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                Login
              </Link>
              <Link to="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-black text-black transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 20px rgba(245,158,11,0.4)' }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button type="button" className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1"
          style={{ background: 'rgba(5,8,16,0.95)' }}>
          {(isAuthenticated ? navLinks : [navLinks[5]]).map(({ to, label, icon }) => (
            <Link key={to} to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                ${isActive(to) ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-400'}`}>
              <span>{icon}</span>{label}
            </Link>
          ))}
          {isAuthenticated && wallet && (
            <div className="flex gap-3 px-3 py-2 border-t border-white/5 mt-1">
              <span className="text-yellow-400 font-black text-sm">🪙 {wallet.coins.toLocaleString()}</span>
              <span className="text-cyan-400 font-black text-sm">💎 {wallet.gems}</span>
            </div>
          )}
          {isAuthenticated && (
            <button type="button" onClick={handleLogout}
              className="text-left px-3 py-2 text-sm text-red-400 font-semibold">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
