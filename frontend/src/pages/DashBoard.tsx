import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCollection } from '../api/cards';
import { getBattleHistory } from '../api/battle';
import type { CollectionItem, BattleRecord } from '../types';
import { RARITY_LABELS, RARITY_COLORS } from '../types';

export default function Dashboard() {
  const { user, wallet, refreshWallet } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [battles, setBattles] = useState<BattleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCollection().then(d => setCollection(d.data.collection)),
      getBattleHistory().then(d => setBattles(d.data.history)),
      refreshWallet(),
    ]).finally(() => setLoading(false));
  }, []);

  const wins = battles.filter(b => b.winner_id === user?.user_id).length;
  const rarityCount = collection.reduce((acc, c) => {
    acc[c.rarity] = (acc[c.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const bestCard = collection[0];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 text-xl animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">
          Welcome back, <span className="text-yellow-400">{user?.username}</span>
        </h1>
        <p className="text-gray-400 mb-8">Here's your fighter stats overview.</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Cards Owned', value: collection.length, icon: '🃏', color: 'text-yellow-400' },
            { label: 'Coins', value: wallet?.coins.toLocaleString() ?? 0, icon: '🪙', color: 'text-yellow-400' },
            { label: 'Gems', value: wallet?.gems ?? 0, icon: '💎', color: 'text-cyan-400' },
            { label: 'Battle Wins', value: wins, icon: '🏆', color: 'text-green-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Rarity breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-black text-white mb-4">Collection by Rarity</h2>
            {Object.keys(rarityCount).length === 0 ? (
              <p className="text-gray-500 text-sm">No cards yet. <Link to="/store" className="text-yellow-400">Open a pack!</Link></p>
            ) : (
              <div className="space-y-2">
                {Object.entries(rarityCount).map(([rarity, count]) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-black"
                      style={{ backgroundColor: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}
                    >
                      {RARITY_LABELS[rarity as keyof typeof RARITY_LABELS]}
                    </span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Best card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-black text-white mb-4">Top Card</h2>
            {bestCard ? (
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border-2"
                  style={{ borderColor: RARITY_COLORS[bestCard.rarity], background: `${RARITY_COLORS[bestCard.rarity]}22` }}
                >
                  🥊
                </div>
                <div>
                  <p className="font-black text-white">{bestCard.first_name} {bestCard.last_name}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-black" style={{ backgroundColor: RARITY_COLORS[bestCard.rarity] }}>
                    {RARITY_LABELS[bestCard.rarity]}
                  </span>
                  <p className="text-gray-400 text-sm mt-1">CP {bestCard.combat_power} · Level {bestCard.level}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No cards yet.</p>
            )}
          </div>
        </div>

        {/* Recent battles */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-black text-white mb-4">Recent Battles</h2>
          {battles.length === 0 ? (
            <p className="text-gray-500 text-sm">No battles yet. <Link to="/battle" className="text-yellow-400">Start fighting!</Link></p>
          ) : (
            <div className="space-y-2">
              {battles.slice(0, 5).map((b: any) => {
                const won = b.winner_id === user?.user_id;
                const draw = b.winner_id === null;
                return (
                  <div key={b.battle_id} className={`flex justify-between items-center p-3 rounded-lg ${won ? 'bg-green-900/20 border border-green-800' : draw ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-red-900/20 border border-red-900'}`}>
                    <span className="text-sm text-gray-300">
                      {b.challenger_fighter_first ?? 'Unknown'} {b.challenger_fighter_last ?? ''} vs {b.opponent_fighter_first ?? 'AI'}
                    </span>
                    <span className={`text-sm font-black ${won ? 'text-green-400' : draw ? 'text-yellow-400' : 'text-red-400'}`}>
                      {won ? 'WIN' : draw ? 'DRAW' : 'LOSS'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/store', label: '📦 Open Packs', bg: 'bg-yellow-600 hover:bg-yellow-500' },
            { to: '/battle', label: '⚔ Battle', bg: 'bg-green-700 hover:bg-green-600' },
            { to: '/collection', label: '🃏 Collection', bg: 'bg-blue-700 hover:bg-blue-600' },
            { to: '/marketplace', label: '🔄 Marketplace', bg: 'bg-purple-700 hover:bg-purple-600' },
          ].map(a => (
            <Link key={a.to} to={a.to} className={`${a.bg} text-white text-center py-3 rounded-xl font-bold text-sm transition-colors`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
