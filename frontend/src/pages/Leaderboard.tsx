import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/battle';
import type { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';

const podiumColors = ['#eab308', '#9ca3af', '#b45309'];
const podiumGlows  = ['rgba(234,179,8,0.4)', 'rgba(156,163,175,0.3)', 'rgba(180,83,9,0.3)'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(d => setEntries(d.data.leaderboard)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        <p className="text-yellow-400 font-bold">Loading leaderboard...</p>
      </div>
    </div>
  );

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Hall of Fame</p>
          <h1 className="text-4xl font-black text-white">🏆 <span className="text-gradient-gold">Leaderboard</span></h1>
          <p className="text-gray-500 mt-2">Top fighters ranked by battle wins</p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
            <div className="text-5xl mb-4">⚔</div>
            <p className="text-gray-400 font-bold mb-1">No battles yet</p>
            <p className="text-gray-600 text-sm">Be the first to claim glory!</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            {top3.length > 0 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {[top3[1], top3[0], top3[2]].map((entry, displayIdx) => {
                  if (!entry) return <div key={displayIdx} className="w-28" />;
                  const rankIdx = top3.indexOf(entry);
                  const color = podiumColors[rankIdx];
                  const glow  = podiumGlows[rankIdx];
                  const isMe  = entry.user_id === user?.user_id;
                  const podiumH = ['h-28', 'h-36', 'h-24'][displayIdx];
                  return (
                    <div key={entry.user_id} className="flex flex-col items-center gap-2 w-28">
                      <div className="w-full rounded-2xl border-2 p-3 text-center transition-all hover:scale-105"
                        style={{
                          borderColor: color,
                          background: `linear-gradient(160deg,${color}22,#0d0d16)`,
                          boxShadow: `0 0 30px ${glow}`,
                        }}>
                        <div className="text-3xl mb-1">{['🥈','🥇','🥉'][displayIdx]}</div>
                        <p className="font-black text-sm truncate" style={{ color }}>
                          {entry.username}{isMe ? ' ★' : ''}
                        </p>
                        <p className="text-white font-black text-lg">{entry.wins}</p>
                        <p className="text-gray-500 text-xs">wins</p>
                        <p className="text-xs font-bold mt-1" style={{ color }}>{entry.win_rate}%</p>
                      </div>
                      <div className={`w-full ${podiumH} rounded-t-xl flex items-center justify-center font-black text-2xl`}
                        style={{ background: `linear-gradient(180deg,${color}44,${color}22)`, border: `1px solid ${color}44` }}>
                        {rankIdx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Remaining entries */}
            {rest.length > 0 && (
              <div className="rounded-2xl border border-white/5 overflow-hidden"
                style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
                <div className="px-5 py-3 border-b border-white/5 grid grid-cols-12 text-xs font-black uppercase tracking-wider text-gray-600">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">Player</span>
                  <span className="col-span-2 text-right">Wins</span>
                  <span className="col-span-2 text-right">Losses</span>
                  <span className="col-span-2 text-right">Win%</span>
                  <span className="col-span-1 text-right">Total</span>
                </div>
                <div className="divide-y divide-white/5">
                  {rest.map((entry, i) => {
                    const isMe = entry.user_id === user?.user_id;
                    return (
                      <div key={entry.user_id}
                        className="px-5 py-3 grid grid-cols-12 items-center"
                        style={{ background: isMe ? 'rgba(234,179,8,0.06)' : undefined }}>
                        <span className="col-span-1 text-gray-600 font-black text-sm">#{i + 4}</span>
                        <span className="col-span-4 font-black text-sm truncate"
                          style={{ color: isMe ? '#eab308' : '#fff' }}>
                          {entry.username}{isMe ? ' ★' : ''}
                        </span>
                        <span className="col-span-2 text-right text-green-400 font-black">{entry.wins}</span>
                        <span className="col-span-2 text-right text-red-400 font-bold">{entry.losses}</span>
                        <span className="col-span-2 text-right text-cyan-400 font-black">{entry.win_rate}%</span>
                        <span className="col-span-1 text-right text-gray-500 text-sm">{entry.total_battles}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
