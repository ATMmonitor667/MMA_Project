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

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">👤 Profile</h1>

        {/* User card */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-black text-black">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-black text-white">{user?.username}</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${user?.role === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              {user?.role}
            </span>
          </div>
          {wallet && (
            <div className="ml-auto text-right">
              <p className="text-yellow-400 font-black">🪙 {wallet.coins.toLocaleString()}</p>
              <p className="text-cyan-400 font-black">💎 {wallet.gems}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['info', 'password'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(''); setMessage(''); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === t ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {t === 'info' ? '✏ Edit Profile' : '🔒 Change Password'}
            </button>
          ))}
        </div>

        {(message || error) && (
          <div className={`mb-4 p-3 rounded-lg border ${error ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-green-900/50 border-green-700 text-green-300'}`}>
            {message || error}
          </div>
        )}

        {tab === 'info' ? (
          <form onSubmit={handleProfileUpdate} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="profile-username" className="block text-sm text-gray-400 mb-1">Username</label>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
            {[
              { label: 'Current Password', id: 'pw-current', val: currentPassword, set: setCurrentPassword },
              { label: 'New Password', id: 'pw-new', val: newPassword, set: setNewPassword },
              { label: 'Confirm New Password', id: 'pw-confirm', val: confirmPassword, set: setConfirmPassword },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm text-gray-400 mb-1">{field.label}</label>
                <input
                  id={field.id}
                  type="password"
                  value={field.val}
                  onChange={e => field.set(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
