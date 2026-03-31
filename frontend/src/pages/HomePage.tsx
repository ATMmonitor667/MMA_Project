import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const rarities = [
  { label: 'Common',     color: '#9CA3AF', pct: '45%',  glow: 'rgba(156,163,175,0.3)' },
  { label: 'Uncommon',   color: '#22C55E', pct: '25%',  glow: 'rgba(34,197,94,0.3)'   },
  { label: 'Rare',       color: '#3B82F6', pct: '15%',  glow: 'rgba(59,130,246,0.3)'  },
  { label: 'Super Rare', color: '#A855F7', pct: '8%',   glow: 'rgba(168,85,247,0.3)'  },
  { label: 'Epic',       color: '#F97316', pct: '4%',   glow: 'rgba(249,115,22,0.3)'  },
  { label: 'Legendary',  color: '#EAB308', pct: '2.5%', glow: 'rgba(234,179,8,0.4)'   },
  { label: 'Ultra Rare', color: '#EF4444', pct: '0.5%', glow: 'rgba(239,68,68,0.4)'   },
];

const features = [
  { icon: '📦', title: 'Open Packs',    desc: 'Three pack tiers — Basic, Premium, Elite. Each with weighted rarity odds.', color: '#f59e0b' },
  { icon: '⚔',  title: 'Battle',        desc: 'Three-round stat battles vs AI or other players. Win coins and XP.', color: '#22c55e' },
  { icon: '🔄', title: 'Trade',         desc: 'List cards on the marketplace. Buy, sell, or swap with other collectors.', color: '#3b82f6' },
  { icon: '⬆',  title: 'Level Up',      desc: 'Cards gain XP from battles. Each level boosts all stats by 8%.', color: '#a855f7' },
];

const stats = [
  { value: '100+', label: 'UFC Fighters' },
  { value: '7',    label: 'Rarity Tiers' },
  { value: '3',    label: 'Battle Rounds' },
  { value: '∞',    label: 'Possibilities' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Radial glow backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: '#f59e0b' }} />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-15"
            style={{ background: '#ef4444' }} />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full blur-[80px] opacity-10"
            style={{ background: '#3b82f6' }} />
        </div>
        <div className="bg-grid absolute inset-0 pointer-events-none opacity-40" />

        {/* Badge */}
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold"
          style={{ borderColor: 'rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)', color: '#fbbf24' }}>
          <span className="w-2 h-2 rounded-full bg-yellow-400 glow-pulse" />
          The Ultimate MMA Card Game
        </div>

        <h1 className="relative z-10 text-6xl md:text-8xl font-black leading-none tracking-tighter mb-4">
          <span className="text-gradient-gold">MMA</span>
          <br />
          <span className="text-white">CARDS</span>
        </h1>

        <p className="relative z-10 text-lg md:text-xl text-gray-400 max-w-lg mb-10 leading-relaxed">
          Collect legendary fighters, build your deck, battle rivals, and trade your way to the top.
        </p>

        <div className="relative z-10 flex flex-wrap gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/store"
                className="px-8 py-3.5 rounded-xl font-black text-base text-black transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
                📦 Open Packs
              </Link>
              <Link to="/battle"
                className="px-8 py-3.5 rounded-xl font-black text-base text-white border border-white/20 hover:bg-white/5 transition-all hover:scale-105">
                ⚔ Battle Now
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup"
                className="px-8 py-3.5 rounded-xl font-black text-base text-black transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 30px rgba(245,158,11,0.5)' }}>
                Start for Free →
              </Link>
              <Link to="/leaderboard"
                className="px-8 py-3.5 rounded-xl font-black text-base text-gray-300 border border-white/10 hover:bg-white/5 transition-all hover:scale-105">
                View Leaderboard
              </Link>
            </>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-xs text-gray-500">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-8 border-y border-white/5"
        style={{ background: 'linear-gradient(90deg,rgba(245,158,11,0.05),rgba(239,68,68,0.05))' }}>
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-4xl font-black text-gradient-gold stat-num">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RARITY TIERS ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-black text-white mb-2">7 Rarity Tiers</h2>
          <p className="text-center text-gray-500 mb-10">From Common to Ultra Rare — every pull is a chance at glory</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {rarities.map((r, i) => (
              <div key={r.label}
                className="relative rounded-2xl p-4 text-center border transition-all hover:scale-105 hover:-translate-y-1 duration-300"
                style={{
                  borderColor: `${r.color}44`,
                  background: `linear-gradient(160deg,${r.color}12,#0d0d16)`,
                  boxShadow: `0 4px 20px ${r.glow}`,
                }}>
                <div className="text-2xl mb-2">{'⭐'.repeat(Math.min(i + 1, 5))}</div>
                <p className="font-black text-sm" style={{ color: r.color }}>{r.label}</p>
                <p className="text-xs text-gray-500 mt-1">{r.pct} drop</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider mx-8" />

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-black text-white mb-2">How It Works</h2>
          <p className="text-center text-gray-500 mb-12">Everything you need in one card game</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(f => (
              <div key={f.title}
                className="group relative rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                style={{ background: 'linear-gradient(160deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))' }}>
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ background: f.color, transform: 'translate(30%,-30%)' }} />
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                <div className="mt-4 h-px w-12 rounded-full transition-all duration-300 group-hover:w-24"
                  style={{ background: f.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(ellipse at center,#f59e0b,transparent 70%)' }} />
          </div>
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-3">
              Ready to <span className="text-gradient-gold">Fight</span>?
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Sign up free — receive <span className="text-yellow-400 font-bold">1,000 coins</span> &amp;{' '}
              <span className="text-cyan-400 font-bold">50 gems</span> to start your collection.
            </p>
            <Link to="/signup"
              className="inline-block px-12 py-4 rounded-2xl font-black text-xl text-black transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 50px rgba(245,158,11,0.4)' }}>
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
