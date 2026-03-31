import { useEffect, useState } from 'react';
import { getDailyStatus, claimDailyReward } from '../../api/dailyReward';
import { useAuth } from '../../context/AuthContext';

interface RewardTier {
  day: number;
  coins: number;
  gems: number;
  label: string;
}

interface DailyStatus {
  streak_count: number;
  can_claim: boolean;
  next_reward: RewardTier;
  hours_until_reset: number;
}

interface Props {
  onClose: () => void;
}

export default function DailyRewardModal({ onClose }: Props) {
  const { refreshWallet } = useAuth();
  const [status, setStatus] = useState<DailyStatus | null>(null);
  const [tiers, setTiers] = useState<RewardTier[]>([]);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState<{ reward: RewardTier; new_streak: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getDailyStatus()
      .then((d: any) => {
        setStatus(d.data.status);
        setTiers(d.data.tiers);
      })
      .catch(() => setError('Failed to load reward status'));
  }, []);

  const handleClaim = async () => {
    if (!status?.can_claim) return;
    setClaiming(true);
    setError('');
    try {
      const res: any = await claimDailyReward();
      setClaimed(res.data);
      await refreshWallet();
      setStatus(prev => prev ? { ...prev, can_claim: false } : prev);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to claim reward');
    } finally {
      setClaiming(false);
    }
  };

  const activeDay = status ? (status.streak_count % 7) + 1 : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-yellow-500/30 overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1a1200,#0d0d16)', boxShadow: '0 0 80px rgba(234,179,8,0.25)' }}
      >
        {/* Header */}
        <div className="relative p-6 text-center border-b border-white/5"
          style={{ background: 'linear-gradient(135deg,rgba(234,179,8,0.12),rgba(245,158,11,0.06))' }}>
          <div className="text-5xl mb-2">🎁</div>
          <h2 className="text-2xl font-black text-white">Daily Login Reward</h2>
          {status && (
            <p className="text-yellow-400 text-sm mt-1 font-semibold">
              {status.streak_count > 0
                ? `${status.streak_count}-day streak! Keep it up`
                : 'Start your streak today!'}
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tier grid */}
        <div className="p-6">
          {tiers.length > 0 && (
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {tiers.map((tier) => {
                const isActive = tier.day === activeDay && !claimed;
                const isPast = status ? tier.day <= (status.streak_count % 7) && status.streak_count > 0 && !claimed : false;
                return (
                  <div
                    key={tier.day}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all"
                    style={{
                      borderColor: isActive ? 'rgba(234,179,8,0.6)' : isPast ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)',
                      background: isActive
                        ? 'rgba(234,179,8,0.15)'
                        : isPast
                          ? 'rgba(34,197,94,0.08)'
                          : 'rgba(255,255,255,0.03)',
                      boxShadow: isActive ? '0 0 16px rgba(234,179,8,0.3)' : 'none',
                    }}
                  >
                    <span className="text-xs font-black" style={{ color: isPast ? '#22c55e' : isActive ? '#fbbf24' : '#6b7280' }}>
                      {isPast ? '✓' : `D${tier.day}`}
                    </span>
                    <span className="text-xs text-center leading-tight font-bold" style={{ color: isActive ? '#fbbf24' : '#9ca3af' }}>
                      {tier.coins}🪙
                    </span>
                    {tier.gems > 0 && (
                      <span className="text-xs font-bold text-cyan-400">{tier.gems}💎</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Claim result */}
          {claimed ? (
            <div className="text-center py-4 rounded-2xl border border-green-500/30"
              style={{ background: 'rgba(34,197,94,0.08)' }}>
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-400 font-black text-lg">Reward Claimed!</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-yellow-400 font-black text-xl">+{claimed.reward.coins} 🪙</span>
                {claimed.reward.gems > 0 && (
                  <span className="text-cyan-400 font-black text-xl">+{claimed.reward.gems} 💎</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">Day {claimed.new_streak} streak</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl font-black text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}
              >
                Awesome!
              </button>
            </div>
          ) : (
            <>
              {error && (
                <p className="text-red-400 text-sm text-center mb-3">{error}</p>
              )}
              {status && !status.can_claim ? (
                <div className="text-center py-3 rounded-xl border border-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-gray-400 text-sm">Already claimed today</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Next reward in {status.hours_until_reset}h
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleClaim}
                  disabled={claiming || !status?.can_claim}
                  className="w-full py-4 rounded-2xl font-black text-lg text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: claiming ? '#374151' : 'linear-gradient(135deg,#d97706,#fbbf24,#f59e0b)', boxShadow: '0 0 40px rgba(234,179,8,0.35)' }}
                >
                  {claiming ? 'Claiming...' : `Claim +${status?.next_reward?.coins ?? '?'} 🪙${(status?.next_reward?.gems ?? 0) > 0 ? ` +${status.next_reward.gems} 💎` : ''}`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
