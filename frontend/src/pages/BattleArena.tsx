import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { CollectionItem } from '../types';
import { RARITY_LABELS, RARITY_COLORS } from '../types';
import { getCollection } from '../api/cards';
import { challengeBattle } from '../api/battle';
import FighterCard from '../components/Fighter/FighterCard';
import BattleView from '../components/Battle/BattleView';
import { useAuth } from '../context/AuthContext';

export default function BattleArena() {
  const location = useLocation();
  const { refreshWallet } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [selected, setSelected] = useState<CollectionItem | null>(
    (location.state as any)?.preselectedCard ?? null
  );
  const [loading, setLoading] = useState(true);
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getCollection().then(d => setCollection(d.data.collection)).finally(() => setLoading(false));
  }, []);

  const handleBattle = async () => {
    if (!selected) return;
    setBattling(true);
    setError('');
    try {
      const res = await challengeBattle(selected.card_id, undefined, 'ai');
      setBattleResult(res.data);
      await refreshWallet();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Battle failed');
    } finally {
      setBattling(false);
    }
  };

  const handleBattleDone = () => {
    setBattleResult(null);
    getCollection().then(d => setCollection(d.data.collection));
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
        <p className="text-green-400 font-bold">Loading arena...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {battleResult && (
        <BattleView
          result={battleResult.result}
          rounds={battleResult.rounds}
          challengerCard={battleResult.challenger_card}
          opponentCard={battleResult.opponent_card}
          xpGained={battleResult.xp_gained}
          coinsWon={battleResult.coins_won}
          onClose={handleBattleDone}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Battle Arena</p>
          <h1 className="text-4xl font-black text-white">⚔ <span className="text-gradient-gold">Fight</span></h1>
          <p className="text-gray-400 mt-1">Select a fighter — challenge the AI — earn coins and XP.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Reward info */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Win', xp: '+50 XP', coins: '+100 🪙', color: '#22c55e' },
            { label: 'Draw', xp: '+20 XP', coins: '+25 🪙', color: '#eab308' },
            { label: 'Loss', xp: '+15 XP', coins: '—', color: '#ef4444' },
          ].map(r => (
            <div key={r.label} className="rounded-xl border border-white/5 p-3 text-center"
              style={{ background: `linear-gradient(160deg,${r.color}10,#0d0d16)` }}>
              <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: r.color }}>{r.label}</p>
              <p className="text-white text-sm font-bold">{r.xp}</p>
              <p className="text-gray-400 text-xs">{r.coins}</p>
            </div>
          ))}
        </div>

        {/* Selected fighter panel */}
        {selected && (
          <div className="mb-8 rounded-2xl border overflow-hidden"
            style={{
              borderColor: `${RARITY_COLORS[selected.rarity]}44`,
              background: `linear-gradient(160deg,${RARITY_COLORS[selected.rarity]}10,#0d0d16)`,
              boxShadow: `0 0 40px ${RARITY_COLORS[selected.rarity]}22`,
            }}>
            <div className="p-4 border-b border-white/5">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500">Selected Fighter</p>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center gap-6">
              <FighterCard card={selected} />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-white mb-1">{selected.first_name} {selected.last_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-black px-2 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: RARITY_COLORS[selected.rarity] }}>
                    {RARITY_LABELS[selected.rarity]}
                  </span>
                  <span className="text-gray-400 text-sm">CP {selected.combat_power}</span>
                  <span className="text-gray-600 text-xs">·</span>
                  <span className="text-gray-400 text-sm">Level {selected.level}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleBattle}
                    disabled={battling}
                    className="px-8 py-3.5 rounded-xl font-black text-lg text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ background: battling ? '#374151' : 'linear-gradient(135deg,#14532d,#22c55e)',
                      boxShadow: battling ? 'none' : '0 0 30px rgba(34,197,94,0.4)' }}
                  >
                    {battling ? '⚔ Fighting...' : '⚔ Fight AI!'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 font-bold transition-all hover:scale-105"
                  >
                    Change Fighter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card picker */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-4">
            {selected ? 'Or pick a different fighter:' : 'Choose your fighter:'}
          </h2>

          {collection.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5"
              style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
              <div className="text-5xl mb-4">🃏</div>
              <p className="text-gray-400 text-lg mb-2 font-bold">No fighters yet</p>
              <p className="text-gray-600 text-sm mb-6">Open packs to get your first card</p>
              <Link to="/store"
                className="inline-block px-6 py-3 rounded-xl font-black text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                📦 Open Packs
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              {collection.map(card => (
                <FighterCard
                  key={card.collection_id}
                  card={card}
                  selected={selected?.card_id === card.card_id}
                  onClick={() => setSelected(card)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
