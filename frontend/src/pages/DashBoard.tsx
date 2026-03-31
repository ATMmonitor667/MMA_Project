import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCollection } from '../api/cards';
import { getBattleHistory } from '../api/battle';
import type { CollectionItem } from '../types';
import { RARITY_LABELS, RARITY_COLORS } from '../types';

export default function Dashboard() {
  const { user, wallet, refreshWallet } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCollection().then((d: any) => setCollection(d.data.collection)),
      getBattleHistory().then((d: any) => setBattles(d.data.history)),
      refreshWallet(),
    ]).finally(() => setLoading(false));
  }, []);

  const wins = battles.filter((b: any) => b.winner_id === user?.user_id).length;
  const losses = battles.filter((b: any) => b.winner_id !== null && b.winner_id !== user?.user_id).length;
  const winRate = battles.length > 0 ? Math.round((wins / battles.length) * 100) : 0;

  const rarityCount = collection.reduce((acc: Record<string, number>, c) => {
    acc[c.rarity] = (acc[c.rarity] || 0) + 1;
    return acc;
  }, {});

  const bestCard = collection[0];

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        <p className="text-yellow-400 font-bold">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1">Welcome back</p>
          <h1 className="text-4xl font-black text-gradient-gold">{user?.username}</h1>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {([
            { label: 'Cards Owned', value: collection.length,                    icon: '🃏', color: '#f59e0b', sub: 'in collection' },
            { label: 'Coins',       value: wallet?.coins.toLocaleString() ?? '0', icon: '🪙', color: '#eab308', sub: 'available'    },
            { label: 'Gems',        value: wallet?.gems ?? 0,                     icon: '💎', color: '#22d3ee', sub: 'premium'      },
            { label: 'Win Rate',    value: `${winRate}%`,                         icon: '🏆', color: '#22c55e', sub: `${wins}W / ${losses}L` },
          ] as const).map(stat => (
            <div key={stat.label}
              className="relative rounded-2xl p-5 border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
              style={{ background: `linear-gradient(160deg,${stat.color}12,#0d0d16)` }}>
              <div className="absolute top-3 right-3 text-2xl opacity-60">{stat.icon}</div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-gray-600 text-xs mt-1">{stat.sub}</p>
              <div className="absolute bottom-0 left-0 h-0.5 w-full opacity-40"
                style={{ background: `linear-gradient(90deg,${stat.color},transparent)` }} />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Best card */}
          <div className="rounded-2xl border border-white/5 p-5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.03),#0d0d16)' }}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Top Fighter</h2>
            {bestCard ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: `linear-gradient(135deg,${RARITY_COLORS[bestCard.rarity]}22,#000)`,
                    border: `2px solid ${RARITY_COLORS[bestCard.rarity]}66`,
                    boxShadow: `0 0 20px ${RARITY_COLORS[bestCard.rarity]}44`,
                  }}>
                  🥊
                </div>
                <div className="min-w-0">
                  <p className="font-black text-white truncate">{bestCard.first_name} {bestCard.last_name}</p>
                  <span className="text-xs font-black px-2 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: RARITY_COLORS[bestCard.rarity] }}>
                    {RARITY_LABELS[bestCard.rarity]}
                  </span>
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                    <span>CP <strong className="text-white">{bestCard.combat_power}</strong></span>
                    <span>LV <strong className="text-white">{bestCard.level}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm mb-2">No cards yet</p>
                <Link to="/store" className="text-yellow-400 text-sm font-bold hover:text-yellow-300">Open a pack →</Link>
              </div>
            )}
          </div>

          {/* Rarity breakdown */}
          <div className="rounded-2xl border border-white/5 p-5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.03),#0d0d16)' }}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Collection Breakdown</h2>
            {Object.keys(rarityCount).length === 0 ? (
              <p className="text-gray-600 text-sm">Empty — <Link to="/store" className="text-yellow-400">open packs!</Link></p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(rarityCount).map(([rarity, count]) => {
                  const color = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] ?? '#888';
                  const pct = Math.round((count / collection.length) * 100);
                  return (
                    <div key={rarity}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold" style={{ color }}>
                          {RARITY_LABELS[rarity as keyof typeof RARITY_LABELS]}
                        </span>
                        <span className="text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/40 overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}88` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Battle record */}
          <div className="rounded-2xl border border-white/5 p-5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.03),#0d0d16)' }}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Battle Record</h2>
            <div className="flex gap-4 mb-4">
              {([
                { label: 'Wins',   val: wins,           color: '#22c55e' },
                { label: 'Losses', val: losses,          color: '#ef4444' },
                { label: 'Total',  val: battles.length,  color: '#a855f7' },
              ] as const).map(s => (
                <div key={s.label} className="text-center flex-1">
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
            {battles.length > 0 && (
              <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                <div className="h-full rounded-full"
                  style={{ width: `${winRate}%`, background: 'linear-gradient(90deg,#16a34a,#4ade80)' }} />
              </div>
            )}
            {battles.length === 0 && (
              <Link to="/battle" className="text-green-400 text-sm font-bold hover:text-green-300">Start battling →</Link>
            )}
          </div>
        </div>

        {/* Recent battles */}
        <div className="rounded-2xl border border-white/5 p-5 mb-8"
          style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Recent Battles</h2>
            <Link to="/battle" className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold">New Battle →</Link>
          </div>
          {battles.length === 0 ? (
            <p className="text-gray-600 text-sm py-4 text-center">No battles yet.</p>
          ) : (
            <div className="space-y-2">
              {battles.slice(0, 5).map((b: any) => {
                const won = b.winner_id === user?.user_id;
                const draw = b.winner_id === null;
                return (
                  <div key={b.battle_id}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{
                      background: won ? 'rgba(34,197,94,0.06)' : draw ? 'rgba(234,179,8,0.06)' : 'rgba(239,68,68,0.06)',
                      borderColor: won ? 'rgba(34,197,94,0.2)' : draw ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                    }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${won ? 'bg-green-400' : draw ? 'bg-yellow-400' : 'bg-red-400'}`} />
                      <span className="text-sm text-gray-300 truncate">
                        {b.challenger_fighter_first ?? 'You'} vs {b.opponent_fighter_first ?? 'AI'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {b.coins_won > 0 && <span className="text-yellow-400 text-xs font-bold">+{b.coins_won}🪙</span>}
                      <span className={`text-sm font-black ${won ? 'text-green-400' : draw ? 'text-yellow-400' : 'text-red-400'}`}>
                        {won ? 'WIN' : draw ? 'DRAW' : 'LOSS'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { to: '/store',       label: 'Open Packs',  icon: '📦', grad: 'linear-gradient(135deg,#92400e,#f59e0b)' },
            { to: '/battle',      label: 'Battle',      icon: '⚔',  grad: 'linear-gradient(135deg,#14532d,#22c55e)' },
            { to: '/collection',  label: 'Collection',  icon: '🃏', grad: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' },
            { to: '/marketplace', label: 'Marketplace', icon: '🔄', grad: 'linear-gradient(135deg,#581c87,#a855f7)' },
          ] as const).map(a => (
            <Link key={a.to} to={a.to}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95 hover:brightness-110"
              style={{ background: a.grad }}>
              <span className="text-lg">{a.icon}</span>{a.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
