import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/auth';

export default function UserProfile() {
  const { user, wallet } = useAuth();
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      await updateProfile({ username, email });
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError(''); setMessage('');
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Account</p>
          <h1 className="text-4xl font-black text-white">👤 <span className="text-gradient-gold">Profile</span></h1>
        </div>

        {/* User hero card */}
        <div className="rounded-2xl border border-white/5 p-6 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg,rgba(245,158,11,0.08),#0d0d16)' }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10"
            style={{ background: '#f59e0b', transform: 'translate(30%,-30%)' }} />
          <div className="relative z-10 flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-black shrink-0"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-black text-white truncate">{user?.username}</p>
              <p className="text-gray-400 text-sm truncate">{user?.email}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black mt-1 inline-block ${
                user?.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}>
                {user?.role}
              </span>
            </div>
            {wallet && (
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-2">
                  <span>🪙</span>
                  <span className="text-yellow-400 font-black tabular-nums">{wallet.coins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <span>💎</span>
                  <span className="text-cyan-400 font-black">{wallet.gems}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl border border-white/5 w-fit"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          {(['info', 'password'] as const).map(t => (
            <button key={t} type="button"
              onClick={() => { setTab(t); setError(''); setMessage(''); }}
              className="px-5 py-2 rounded-lg font-black text-sm transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg,#92400e,#f59e0b)' : 'transparent',
                color: tab === t ? '#000' : '#9ca3af',
              }}>
              {t === 'info' ? '✏ Edit Profile' : '🔒 Change Password'}
            </button>
          ))}
        </div>

        {(message || error) && (
          <div className={`mb-5 p-4 rounded-xl border flex items-center gap-2 text-sm ${
            error ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-green-900/20 border-green-500/30 text-green-300'
          }`}>
            <span>{error ? '⚠' : '✓'}</span> {message || error}
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl border border-white/5 p-6"
          style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
          {tab === 'info' ? (
            <form onSubmit={handleProfileUpdate} className="space-y-5">
              {[
                { label: 'Username', id: 'profile-username', type: 'text', val: username, set: setUsername, placeholder: 'fighter123' },
                { label: 'Email', id: 'profile-email', type: 'email', val: email, set: setEmail, placeholder: 'you@example.com' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm font-bold text-gray-400 mb-1.5">{f.label}</label>
                  <input id={f.id} type={f.type} value={f.val} placeholder={f.placeholder}
                    onChange={e => f.set(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm transition-colors focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-black text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-5">
              {[
                { label: 'Current Password', id: 'pw-current', val: currentPassword, set: setCurrentPassword },
                { label: 'New Password', id: 'pw-new', val: newPassword, set: setNewPassword },
                { label: 'Confirm New Password', id: 'pw-confirm', val: confirmPassword, set: setConfirmPassword },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm font-bold text-gray-400 mb-1.5">{f.label}</label>
                  <input id={f.id} type="password" value={f.val}
                    onChange={e => f.set(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-white text-sm transition-colors focus:outline-none"
                    style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-black text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
