import { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/battle';
import type { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(d => setEntries(d.data.leaderboard)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 animate-pulse text-xl">Loading leaderboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400 mb-8">Top fighters ranked by battle wins.</p>

        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No battle data yet. Start fighting!</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const isMe = entry.user_id === user?.user_id;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    isMe
                      ? 'bg-yellow-900/20 border-yellow-600'
                      : i < 3
                      ? 'bg-gray-800 border-gray-600'
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center">
                    {i < 3 ? (
                      <span className="text-2xl">{medals[i]}</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-lg">#{i + 1}</span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex-1">
                    <span className={`font-black text-lg ${isMe ? 'text-yellow-400' : 'text-white'}`}>
                      {entry.username} {isMe && '(You)'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 text-sm text-right">
                    <div>
                      <p className="text-green-400 font-black text-lg">{entry.wins}</p>
                      <p className="text-gray-500 text-xs">Wins</p>
                    </div>
                    <div>
                      <p className="text-red-400 font-black text-lg">{entry.losses}</p>
                      <p className="text-gray-500 text-xs">Losses</p>
                    </div>
                    <div>
                      <p className="text-cyan-400 font-black text-lg">{entry.win_rate}%</p>
                      <p className="text-gray-500 text-xs">Win Rate</p>
                    </div>
                    <div>
                      <p className="text-gray-300 font-black text-lg">{entry.total_battles}</p>
                      <p className="text-gray-500 text-xs">Battles</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
