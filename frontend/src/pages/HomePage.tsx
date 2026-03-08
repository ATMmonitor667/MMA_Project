import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📦', title: 'Collect Cards', desc: 'Open packs to collect fighters across 7 rarity tiers from Common to Ultra Rare.' },
  { icon: '⚔', title: 'Battle', desc: 'Challenge AI or other players. Win coins and XP to level up your cards.' },
  { icon: '🔄', title: 'Trade', desc: 'List your cards on the marketplace and buy cards from other collectors.' },
  { icon: '🏆', title: 'Compete', desc: 'Climb the leaderboard and dominate the rankings with your best fighters.' },
];

const rarityShowcase = [
  { label: 'Common', color: '#9CA3AF' },
  { label: 'Uncommon', color: '#22C55E' },
  { label: 'Rare', color: '#3B82F6' },
  { label: 'Super Rare', color: '#A855F7' },
  { label: 'Epic', color: '#F97316' },
  { label: 'Legendary', color: '#EAB308' },
  { label: 'Ultra Rare', color: '#EF4444' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-transparent pointer-events-none" />
        <h1 className="text-6xl font-black mb-4 tracking-tight">
          🥊 <span className="text-yellow-400">MMA</span> CARD GAME
        </h1>
        <p className="text-xl text-gray-300 max-w-xl mx-auto mb-8">
          Collect legendary fighters, battle opponents, and trade your way to the top of the rankings.
        </p>
        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/store" className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg transition-colors">
                Open Packs
              </Link>
              <Link to="/battle" className="px-8 py-3 rounded-xl border-2 border-yellow-500 hover:border-yellow-400 text-yellow-400 font-black text-lg transition-colors">
                Battle Now
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="px-8 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg transition-colors">
                Start Collecting
              </Link>
              <Link to="/login" className="px-8 py-3 rounded-xl border-2 border-gray-600 hover:border-gray-400 text-gray-300 font-bold text-lg transition-colors">
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Rarity showcase */}
      <section className="py-10 px-4">
        <h2 className="text-center text-2xl font-black text-gray-300 mb-6">7 RARITY TIERS</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {rarityShowcase.map(r => (
            <div
              key={r.label}
              className="px-4 py-2 rounded-full font-bold text-sm text-black"
              style={{ backgroundColor: r.color }}
            >
              {r.label}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-center text-3xl font-black text-white mb-10">HOW TO PLAY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-yellow-400/40 transition-colors">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 px-4 text-center bg-gray-900 border-t border-gray-800">
          <h2 className="text-3xl font-black text-yellow-400 mb-3">Ready to Fight?</h2>
          <p className="text-gray-400 mb-6">Join now and receive 1,000 coins + 50 gems to start your collection.</p>
          <Link to="/signup" className="px-10 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl transition-colors">
            Create Free Account
          </Link>
        </section>
      )}
    </div>
  );
}
