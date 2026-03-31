import { useEffect, useState } from 'react';
import type { CardPack, FighterCard as FighterCardType } from '../types';
import { getAllPacks, openPack } from '../api/cards';
import { useAuth } from '../context/AuthContext';
import PackOpening from '../components/PackOpening/PackOpening';

const packThemes = [
  {
    grad:   'linear-gradient(160deg,#1c1408,#0d0d16)',
    border: '#f59e0b66',
    glow:   '#f59e0b',
    accent: '#f59e0b',
    icon:   '📦',
    badge:  'STARTER',
  },
  {
    grad:   'linear-gradient(160deg,#180d28,#0d0d16)',
    border: '#a855f766',
    glow:   '#a855f7',
    accent: '#a855f7',
    icon:   '💜',
    badge:  'POPULAR',
  },
  {
    grad:   'linear-gradient(160deg,#1a1000,#0d0d16)',
    border: '#eab30866',
    glow:   '#eab308',
    accent: '#eab308',
    icon:   '⭐',
    badge:  'BEST VALUE',
  },
];

export default function CardStore() {
  const { wallet, refreshWallet } = useAuth();
  const [packs, setPacks] = useState<CardPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<{ cards: FighterCardType[]; packName: string } | null>(null);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllPacks().then((d: any) => setPacks(d.data.packs)).finally(() => setLoading(false));
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

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        <p className="text-yellow-400 font-bold">Loading store...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {opening && (
        <PackOpening cards={opening.cards} packName={opening.packName} onDone={() => setOpening(null)} />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Card Store</p>
            <h1 className="text-4xl font-black text-white">Open <span className="text-gradient-gold">Packs</span></h1>
          </div>
          {wallet && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <span>🪙</span>
                <span className="text-yellow-400 font-black tabular-nums">{wallet.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <span>💎</span>
                <span className="text-cyan-400 font-black tabular-nums">{wallet.gems}</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {packs.map((pack, i) => {
            const theme = packThemes[i] ?? packThemes[0];
            const isLoading = buyingId === pack.pack_id;
            const canAffordCoins = (wallet?.coins ?? 0) >= pack.cost_coins;
            const canAffordGems  = (wallet?.gems  ?? 0) >= pack.cost_gems;
            const rarityEntries = Object.entries(pack.rarity_weights)
              .filter(([, w]) => w > 0)
              .sort((a, b) => b[1] - a[1]);

            return (
              <div key={pack.pack_id} className="pack-card relative rounded-2xl overflow-hidden border flex flex-col"
                style={{ background: theme.grad, borderColor: theme.border, boxShadow: `0 0 40px ${theme.glow}22` }}>

                {/* Badge */}
                <div className="absolute top-3 right-3 z-10 text-xs font-black px-2 py-0.5 rounded-full text-black"
                  style={{ backgroundColor: theme.accent }}>
                  {theme.badge}
                </div>

                {/* Shimmer for premium packs */}
                {i > 0 && <div className="shimmer absolute inset-0 pointer-events-none z-0" />}

                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Icon & name */}
                  <div className="text-5xl mb-3 float">{theme.icon}</div>
                  <h2 className="text-2xl font-black text-white mb-1">{pack.name}</h2>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{pack.description}</p>

                  <div className="text-sm text-gray-500 mb-4">
                    <span className="font-bold" style={{ color: theme.accent }}>{pack.cards_per_pack}</span> cards per pack
                  </div>

                  {/* Drop rates */}
                  <div className="rounded-xl p-3 mb-5 flex-1"
                    style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${theme.border}` }}>
                    <p className="text-xs font-black uppercase tracking-wider mb-3"
                      style={{ color: theme.accent }}>Drop Rates</p>
                    <div className="space-y-1.5">
                      {rarityEntries.map(([rarity, weight]) => (
                        <div key={rarity} className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                            <div className="h-full rounded-full"
                              style={{ width: `${weight}%`, background: theme.accent, opacity: 0.7 }} />
                          </div>
                          <div className="flex justify-between w-40 text-xs">
                            <span className="text-gray-400 capitalize">{rarity.replace('_', ' ')}</span>
                            <span className="text-gray-300 font-bold tabular-nums">{weight}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buy buttons */}
                  <div className="flex flex-col gap-2">
                    <button type="button"
                      onClick={() => handleBuy(pack, 'coins')}
                      disabled={isLoading || !canAffordCoins}
                      className="w-full py-3 rounded-xl font-black text-sm text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ background: canAffordCoins ? `linear-gradient(135deg,${theme.accent},${theme.glow})` : '#374151' }}>
                      {isLoading ? '⏳ Opening...' : `🪙 ${pack.cost_coins.toLocaleString()} Coins`}
                    </button>
                    <button type="button"
                      onClick={() => handleBuy(pack, 'gems')}
                      disabled={isLoading || !canAffordGems}
                      className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ background: canAffordGems ? 'linear-gradient(135deg,#0891b2,#22d3ee)' : '#374151' }}>
                      {isLoading ? '⏳ Opening...' : `💎 ${pack.cost_gems} Gems`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
