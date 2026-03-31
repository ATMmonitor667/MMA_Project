import { useState } from 'react';
import type { CollectionItem } from '../../types';
import { RARITY_COLORS, RARITY_LABELS } from '../../types';
import { createListing } from '../../api/trade';

interface TradeModalProps {
  card: CollectionItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TradeModal({ card, onClose, onSuccess }: TradeModalProps) {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const color = RARITY_COLORS[card.rarity];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const askingPrice = Number(price);
    if (isNaN(askingPrice) || askingPrice < 0) { setError('Enter a valid price'); return; }
    setLoading(true);
    setError('');
    try {
      await createListing(card.card_id, askingPrice);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to list card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md">
        <h2 className="text-xl font-black text-white mb-4">List Card for Trade</h2>

        {/* Card preview */}
        <div
          className="rounded-xl border-2 p-4 mb-4 flex items-center gap-4"
          style={{ borderColor: color, background: `${color}11` }}
        >
          <div className="text-4xl">🥊</div>
          <div>
            <p className="text-white font-bold">{card.first_name} {card.last_name}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-black" style={{ backgroundColor: color }}>
              {RARITY_LABELS[card.rarity]}
            </span>
            <p className="text-gray-400 text-xs mt-1">Level {card.level} · CP {card.combat_power}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Asking Price (coins)</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Enter coin price (0 = gift)"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Listing...' : 'List Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
