import { useEffect, useState } from 'react';
import { getCollection } from '../api/cards';
import type { CollectionItem } from '../types';
import { RARITY_COLORS } from '../types';
import FighterCard from '../components/Fighter/FighterCard';
import TradeModal from '../components/Trade/TradeModal';
import { Link, useNavigate } from 'react-router-dom';

const RARITY_ORDER = ['ultra_rare', 'legendary', 'epic', 'super_rare', 'rare', 'uncommon', 'common'];
const RARITY_FILTERS = ['all', 'common', 'uncommon', 'rare', 'super_rare', 'epic', 'legendary', 'ultra_rare'];

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
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        <p className="text-yellow-400 font-bold">Loading collection...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {tradeCard && (
        <TradeModal
          card={tradeCard}
          onClose={() => setTradeCard(null)}
          onSuccess={() => { setTradeCard(null); fetchCollection(); }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Your Arsenal</p>
            <h1 className="text-4xl font-black text-white">🃏 <span className="text-gradient-gold">Collection</span></h1>
            <p className="text-gray-500 mt-1">{collection.length} cards total</p>
          </div>
          {collection.length === 0 && (
            <Link to="/store"
              className="px-5 py-2.5 rounded-xl font-black text-sm text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
              📦 Open Packs
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-y-3 gap-x-4 mb-8 items-center">
          {/* Rarity filter */}
          <div className="flex flex-wrap gap-1.5">
            {RARITY_FILTERS.map(r => {
              const color = r === 'all' ? '#f59e0b' : (RARITY_COLORS[r as keyof typeof RARITY_COLORS] ?? '#9ca3af');
              const active = filter === r;
              return (
                <button key={r} type="button" onClick={() => setFilter(r)}
                  className="text-xs px-3 py-1.5 rounded-full font-black transition-all hover:scale-105 capitalize"
                  style={{
                    background: active ? color : 'rgba(0,0,0,0.4)',
                    color: active ? '#000' : '#9ca3af',
                    border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {r.replace('_', ' ')}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="ml-auto flex gap-1.5">
            {(['cp', 'rarity', 'level'] as const).map(s => (
              <button key={s} type="button" onClick={() => setSort(s)}
                className="text-xs px-3 py-1.5 rounded-full font-black transition-all hover:scale-105"
                style={{
                  background: sort === s ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.4)',
                  color: sort === s ? '#fff' : '#9ca3af',
                  border: `1px solid ${sort === s ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                {s === 'cp' ? 'Combat Power' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        {filtered.length > 0 && filter !== 'all' && (
          <p className="text-gray-600 text-sm mb-4">{filtered.length} cards matching filter</p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
            <div className="text-5xl mb-4">🃏</div>
            <p className="text-gray-400 font-bold mb-2">
              {collection.length === 0 ? 'No cards yet' : 'No cards match this filter'}
            </p>
            {collection.length === 0 && (
              <Link to="/store" className="text-yellow-400 hover:text-yellow-300 font-bold">
                Go open some packs →
              </Link>
            )}
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
