import { useEffect, useState } from 'react';
import type { TradeListing } from '../types';
import { RARITY_COLORS, RARITY_LABELS } from '../types';
import { getListings, acceptOffer, cancelListing, getMyListings } from '../api/trade';
import { useAuth } from '../context/AuthContext';

const RARITIES = ['', 'common', 'uncommon', 'rare', 'super_rare', 'epic', 'legendary', 'ultra_rare'];

export default function Marketplace() {
  const { user, refreshWallet } = useAuth();
  const [listings, setListings] = useState<TradeListing[]>([]);
  const [myListings, setMyListings] = useState<TradeListing[]>([]);
  const [tab, setTab] = useState<'browse' | 'mine'>('browse');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterRarity, setFilterRarity] = useState('');

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      getListings(filterRarity ? { rarity: filterRarity } : undefined).then(d => setListings(d.data.listings)),
      getMyListings().then(d => setMyListings(d.data.listings)),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [filterRarity]);

  const handleBuy = async (listing: TradeListing) => {
    setActionId(listing.listing_id);
    setError(''); setSuccess('');
    try {
      await acceptOffer(listing.listing_id);
      setSuccess('Card purchased successfully!');
      await refreshWallet();
      fetchAll();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (listingId: number) => {
    setActionId(listingId);
    setError(''); setSuccess('');
    try {
      await cancelListing(listingId);
      setSuccess('Listing cancelled.');
      fetchAll();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cancel failed');
    } finally {
      setActionId(null);
    }
  };

  const ListingCard = ({ listing, isMine }: { listing: any; isMine: boolean }) => {
    const color = RARITY_COLORS[listing.rarity as keyof typeof RARITY_COLORS] ?? '#9CA3AF';
    const isLoading = actionId === listing.listing_id;
    const isOwn = listing.seller_id === user?.user_id;
    return (
      <div className="relative rounded-2xl border overflow-hidden flex flex-col transition-all hover:scale-[1.02]"
        style={{
          borderColor: `${color}44`,
          background: `linear-gradient(160deg,${color}10,#0d0d16)`,
          boxShadow: `0 4px 20px ${color}15`,
        }}>
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              🥊
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white truncate">{listing.first_name} {listing.last_name}</p>
              <span className="text-xs font-black px-2 py-0.5 rounded-full text-black inline-block mt-0.5"
                style={{ backgroundColor: color }}>
                {RARITY_LABELS[listing.rarity as keyof typeof RARITY_LABELS]}
              </span>
            </div>
          </div>

          <div className="flex gap-3 text-xs">
            {[
              { label: 'CP', val: listing.combat_power },
              { label: 'Level', val: listing.level },
            ].map(s => (
              <div key={s.label} className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <p className="text-gray-500 mb-0.5">{s.label}</p>
                <p className="font-black text-white">{s.val}</p>
              </div>
            ))}
            <div className="flex-1 rounded-lg p-2 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p className="text-gray-500 mb-0.5">Price</p>
              <p className="font-black text-yellow-400">
                {listing.asking_price === 0 ? 'FREE' : listing.asking_price.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600">by <span className="text-gray-400">{listing.seller_username}</span></p>

          {isMine ? (
            <button type="button" onClick={() => handleCancel(listing.listing_id)} disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: isLoading ? '#374151' : 'linear-gradient(135deg,#7f1d1d,#ef4444)' }}>
              {isLoading ? 'Cancelling...' : '✕ Cancel Listing'}
            </button>
          ) : (
            <button type="button" onClick={() => handleBuy(listing)} disabled={isLoading || isOwn}
              className="w-full py-2.5 rounded-xl font-black text-sm text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: isOwn || isLoading ? '#374151' : `linear-gradient(135deg,${color},${color}cc)`,
                color: isOwn || isLoading ? '#9ca3af' : '#000' }}>
              {isOwn ? 'Your Listing' : isLoading ? 'Buying...' : `🪙 Buy — ${listing.asking_price === 0 ? 'FREE' : listing.asking_price.toLocaleString()}`}
            </button>
          )}
        </div>
      </div>
    );
  };

  const activeListings = tab === 'browse' ? listings : myListings;

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Trading Post</p>
          <h1 className="text-4xl font-black text-white">🔄 <span className="text-gradient-gold">Marketplace</span></h1>
          <p className="text-gray-400 mt-1">Buy and sell fighter cards with other players.</p>
        </div>

        {(error || success) && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-2 text-sm ${
            error ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-green-900/20 border-green-500/30 text-green-300'
          }`}>
            <span>{error ? '⚠' : '✓'}</span> {error || success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl border border-white/5 w-fit"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          {(['browse', 'mine'] as const).map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg font-black text-sm transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg,#92400e,#f59e0b)' : 'transparent',
                color: tab === t ? '#000' : '#9ca3af',
              }}>
              {t === 'browse' ? '🛒 Browse' : '📋 My Listings'}
            </button>
          ))}
        </div>

        {/* Rarity filter */}
        {tab === 'browse' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {RARITIES.map(r => {
              const color = r ? (RARITY_COLORS[r as keyof typeof RARITY_COLORS] ?? '#f59e0b') : '#f59e0b';
              const active = filterRarity === r;
              return (
                <button key={r} type="button" onClick={() => setFilterRarity(r)}
                  className="text-xs px-3 py-1.5 rounded-full font-black transition-all hover:scale-105 capitalize"
                  style={{
                    background: active ? color : 'rgba(0,0,0,0.4)',
                    color: active ? '#000' : '#9ca3af',
                    border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {r === '' ? 'All' : r.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 py-12 justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
            <span className="text-gray-400">Loading listings...</span>
          </div>
        ) : activeListings.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5"
            style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.02),#0d0d16)' }}>
            <div className="text-5xl mb-4">🔄</div>
            <p className="text-gray-400 font-bold mb-1">
              {tab === 'browse' ? 'No listings yet' : 'No active listings'}
            </p>
            <p className="text-gray-600 text-sm">
              {tab === 'browse' ? 'Be the first to list a card!' : 'List a card from your collection.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeListings.map(l => (
              <ListingCard key={l.listing_id} listing={l} isMine={tab === 'mine'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
