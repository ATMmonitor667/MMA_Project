import { useEffect, useState } from 'react';
import { getCollection } from '../api/cards';
import type { CollectionItem } from '../types';
import FighterCard from '../components/Fighter/FighterCard';
import TradeModal from '../components/Trade/TradeModal';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RARITY_ORDER = ['ultra_rare', 'legendary', 'epic', 'super_rare', 'rare', 'uncommon', 'common'];

export default function FighterCardPage() {
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<'cp' | 'rarity' | 'level'>('cp');
  const [tradeCard, setTradeCard] = useState<CollectionItem | null>(null);

  const fetchCollection = () => {
    getCollection().then(d => setCollection(d.data.collection)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCollection(); }, []);

  const filtered = collection
    .filter(c => filter === 'all' || c.rarity === filter)
    .sort((a, b) => {
      if (sort === 'cp') return b.combat_power - a.combat_power;
      if (sort === 'level') return b.level - a.level;
      return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity);
    });

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 animate-pulse text-xl">Loading collection...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {tradeCard && (
        <TradeModal
          card={tradeCard}
          onClose={() => setTradeCard(null)}
          onSuccess={() => { setTradeCard(null); fetchCollection(); }}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-white">My Collection</h1>
            <p className="text-gray-400">{collection.length} cards total</p>
          </div>
          {collection.length === 0 && (
            <Link to="/store" className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors">
              📦 Open Packs
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {['all', 'common', 'uncommon', 'rare', 'super_rare', 'epic', 'legendary', 'ultra_rare'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setFilter(r)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors capitalize ${
                  filter === r ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            {(['cp', 'rarity', 'level'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors ${
                  sort === s ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {s === 'cp' ? 'Combat Power' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl mb-4">No cards found.</p>
            <Link to="/store" className="text-yellow-400 hover:text-yellow-300">Go open some packs →</Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {filtered.map(card => (
              <FighterCard
                key={card.collection_id}
                card={card}
                showActions
                onTrade={() => setTradeCard(card)}
                onBattle={() => navigate('/battle', { state: { preselectedCard: card } })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
