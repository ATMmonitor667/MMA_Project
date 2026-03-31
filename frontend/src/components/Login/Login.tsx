import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-[120px] opacity-15"
          style={{ background: '#f59e0b' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full blur-[100px] opacity-10"
          style={{ background: '#ef4444' }} />
      </div>
      <div className="bg-grid absolute inset-0 pointer-events-none opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 float">🥊</div>
          <h1 className="text-4xl font-black text-gradient-gold">MMA CARDS</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 p-8"
          style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.04),#0d0d16)',
            boxShadow: '0 0 60px rgba(245,158,11,0.08)' }}>

          <h2 className="text-2xl font-black text-white mb-6">Welcome back</h2>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold text-gray-400 mb-1.5">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-bold text-gray-400 mb-1.5">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-lg text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: loading ? '#374151' : 'linear-gradient(135deg,#f59e0b,#ef4444)',
                boxShadow: loading ? 'none' : '0 0 30px rgba(245,158,11,0.4)' }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-600">
              <span className="px-3" style={{ background: '#0d0d16' }}>OR</span>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-black transition-colors">
              Sign Up Free →
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Get <span className="text-yellow-500">1,000 coins</span> &amp; <span className="text-cyan-500">50 gems</span> on signup
        </p>
      </div>
    </div>
  );
}
