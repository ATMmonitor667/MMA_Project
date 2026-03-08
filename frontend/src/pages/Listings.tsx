import { useEffect, useState } from 'react';
import type { TradeListing } from '../types';
import { RARITY_COLORS, RARITY_LABELS } from '../types';
import { getListings, acceptOffer, cancelListing, getMyListings } from '../api/trade';
import { useAuth } from '../context/AuthContext';

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
    return (
      <div
        className="bg-gray-900 border-2 rounded-xl p-4 flex flex-col gap-3"
        style={{ borderColor: color }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: `${color}22` }}>
            🥊
          </div>
          <div className="flex-1">
            <p className="font-black text-white">{listing.first_name} {listing.last_name}</p>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-black" style={{ backgroundColor: color }}>
              {RARITY_LABELS[listing.rarity as keyof typeof RARITY_LABELS]}
            </span>
          </div>
          <div className="text-right">
            <p className="text-yellow-400 font-black">{listing.asking_price === 0 ? 'FREE' : `🪙 ${listing.asking_price.toLocaleString()}`}</p>
            <p className="text-gray-500 text-xs">CP {listing.combat_power} · Lv.{listing.level}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">Seller: {listing.seller_username}</div>
        {isMine ? (
          <button
            type="button"
            onClick={() => handleCancel(listing.listing_id)}
            disabled={actionId === listing.listing_id}
            className="w-full py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
          >
            {actionId === listing.listing_id ? 'Cancelling...' : 'Cancel Listing'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleBuy(listing)}
            disabled={actionId === listing.listing_id || listing.seller_id === user?.user_id}
            className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {listing.seller_id === user?.user_id ? 'Your Listing' : actionId === listing.listing_id ? 'Buying...' : 'Buy Now'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Marketplace</h1>
        <p className="text-gray-400 mb-6">Buy and sell fighter cards with other players.</p>

        {(error || success) && (
          <div className={`mb-4 p-3 rounded-lg border ${error ? 'bg-red-900/50 border-red-700 text-red-300' : 'bg-green-900/50 border-green-700 text-green-300'}`}>
            {error || success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['browse', 'mine'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === t ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {t === 'browse' ? '🛒 Browse' : '📋 My Listings'}
            </button>
          ))}
        </div>

        {/* Rarity filter (browse tab) */}
        {tab === 'browse' && (
          <div className="flex flex-wrap gap-2 mb-5">
            {['', 'common', 'uncommon', 'rare', 'super_rare', 'epic', 'legendary', 'ultra_rare'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setFilterRarity(r)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-colors capitalize ${filterRarity === r ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {r === '' ? 'All' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 animate-pulse">Loading...</p>
        ) : tab === 'browse' ? (
          listings.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">No active listings. Be the first to list a card!</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {listings.map(l => <ListingCard key={l.listing_id} listing={l} isMine={false} />)}
            </div>
          )
        ) : (
          myListings.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">You have no active listings. <a href="/collection" className="text-yellow-400">List a card from your collection.</a></p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myListings.map(l => <ListingCard key={l.listing_id} listing={l} isMine={true} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}
