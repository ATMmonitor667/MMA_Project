import { useEffect, useState } from 'react';
import type { CardPack, FighterCard as FighterCardType } from '../types';
import { getAllPacks, openPack } from '../api/cards';
import { useAuth } from '../context/AuthContext';
import PackOpening from '../components/PackOpening/PackOpening';

export default function CardStore() {
  const { wallet, refreshWallet } = useAuth();
  const [packs, setPacks] = useState<CardPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<{ cards: FighterCardType[]; packName: string } | null>(null);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllPacks().then(d => setPacks(d.data.packs)).finally(() => setLoading(false));
  }, []);

  const handleBuy = async (pack: CardPack, currency: 'coins' | 'gems') => {
    setBuyingId(pack.pack_id);
    setError('');
    try {
      const res = await openPack(pack.pack_id, currency);
      setOpening({ cards: res.data.cards, packName: pack.name });
      await refreshWallet();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to open pack');
    } finally {
      setBuyingId(null);
    }
  };

  const packColors = ['from-gray-800 to-gray-900', 'from-purple-900 to-gray-900', 'from-yellow-900 to-gray-900'];
  const packBorders = ['border-gray-600', 'border-purple-500', 'border-yellow-500'];
  const packIcons = ['📦', '💜', '⭐'];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-yellow-400 text-xl animate-pulse">Loading store...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {opening && (
        <PackOpening
          cards={opening.cards}
          packName={opening.packName}
          onDone={() => setOpening(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Card Store</h1>
        <div className="flex items-center gap-4 mb-8">
          <p className="text-gray-400">Open packs to collect fighters.</p>
          {wallet && (
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-yellow-400 font-bold text-sm">🪙 {wallet.coins.toLocaleString()}</span>
              <span className="text-cyan-400 font-bold text-sm">💎 {wallet.gems}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {packs.map((pack, i) => {
            const rarityEntries = Object.entries(pack.rarity_weights).sort((a, b) => b[1] - a[1]);
            const isLoading = buyingId === pack.pack_id;
            return (
              <div
                key={pack.pack_id}
                className={`bg-gradient-to-b ${packColors[i] ?? 'from-gray-800 to-gray-900'} border-2 ${packBorders[i] ?? 'border-gray-600'} rounded-2xl p-6 flex flex-col`}
              >
                <div className="text-5xl text-center mb-3">{packIcons[i] ?? '📦'}</div>
                <h2 className="text-xl font-black text-white text-center mb-1">{pack.name}</h2>
                <p className="text-gray-400 text-sm text-center mb-4">{pack.description}</p>

                <div className="text-center mb-4">
                  <span className="text-sm text-gray-400">{pack.cards_per_pack} cards per pack</span>
                </div>

                {/* Rarity odds */}
                <div className="bg-black/30 rounded-xl p-3 mb-5 space-y-1 flex-1">
                  <p className="text-xs text-gray-500 font-bold mb-2">DROP RATES</p>
                  {rarityEntries.filter(([, w]) => w > 0).map(([rarity, weight]) => (
                    <div key={rarity} className="flex justify-between text-xs">
                      <span className="text-gray-400 capitalize">{rarity.replace('_', ' ')}</span>
                      <span className="text-gray-300 font-bold">{weight}%</span>
                    </div>
                  ))}
                </div>

                {/* Buy buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleBuy(pack, 'coins')}
                    disabled={isLoading || (wallet?.coins ?? 0) < pack.cost_coins}
                    className="w-full py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Opening...' : `🪙 ${pack.cost_coins.toLocaleString()} Coins`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBuy(pack, 'gems')}
                    disabled={isLoading || (wallet?.gems ?? 0) < pack.cost_gems}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Opening...' : `💎 ${pack.cost_gems} Gems`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
