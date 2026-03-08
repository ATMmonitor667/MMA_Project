import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { CollectionItem } from '../types';
import { RARITY_LABELS } from '../types';
import { getCollection } from '../api/cards';
import { challengeBattle } from '../api/battle';
import FighterCard from '../components/Fighter/FighterCard';
import BattleView from '../components/Battle/BattleView';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 animate-pulse text-xl">Loading arena...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
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

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">⚔ Battle Arena</h1>
        <p className="text-gray-400 mb-8">Select a card and fight an AI opponent. Win coins and XP!</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300">{error}</div>
        )}

        {/* Selected card preview */}
        {selected && (
          <div className="mb-8 p-5 bg-gray-900 border border-gray-700 rounded-2xl flex flex-col md:flex-row items-center gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Selected Fighter</p>
              <FighterCard card={selected} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-2xl font-black text-white mb-1">{selected.first_name} {selected.last_name}</p>
              <p className="text-gray-400 mb-4">CP {selected.combat_power} · Level {selected.level} · {RARITY_LABELS[selected.rarity]}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBattle}
                  disabled={battling}
                  className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-lg transition-colors disabled:opacity-50"
                >
                  {battling ? '⚔ Fighting...' : '⚔ Fight AI!'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 rounded-xl border border-gray-600 hover:border-gray-400 text-gray-300 font-bold transition-colors"
                >
                  Change Card
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-3">Win: +50 XP, +100 🪙 · Loss: +15 XP · Draw: +20 XP</p>
            </div>
          </div>
        )}

        {/* Card picker */}
        <h2 className="text-lg font-black text-gray-300 mb-4">
          {selected ? 'Or pick a different card:' : 'Choose your fighter:'}
        </h2>

        {collection.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl mb-4">No cards in your collection.</p>
            <Link to="/store" className="text-yellow-400 hover:text-yellow-300">Open some packs first →</Link>
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
  );
}
