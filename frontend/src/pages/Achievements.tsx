import { useEffect, useState } from 'react';
import { getAchievements } from '../api/achievements';

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  secret?: boolean;
  unlocked: boolean;
  unlocked_at: string | null;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  battle:      { label: 'Battle',      icon: '⚔',  color: '#22c55e' },
  collection:  { label: 'Collection',  icon: '🃏', color: '#3b82f6' },
  progression: { label: 'Progression', icon: '⬆',  color: '#a855f7' },
  trading:     { label: 'Trading',     icon: '🔄', color: '#f97316' },
  loyalty:     { label: 'Loyalty',     icon: '📅', color: '#eab308' },
};

export default function Achievements() {
  const [byCategory, setByCategory] = useState<Record<string, Achievement[]>>({});
  const [total, setTotal] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    getAchievements()
      .then((d: any) => {
        setByCategory(d.data.byCategory);
        setTotal(d.data.total);
        setUnlocked(d.data.unlocked);
      })
      .finally(() => setLoading(false));
  }, []);

  const allAchievements = Object.values(byCategory).flat();
  const displayed = activeCategory === 'all' ? allAchievements : (byCategory[activeCategory] ?? []);
  const pct = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
        <p className="text-yellow-400 font-bold">Loading achievements...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider">Hall of Fame</p>
          <h1 className="text-4xl font-black">🏆 <span className="text-gradient-gold">Achievements</span></h1>
          <p className="text-gray-400 mt-1">Earn badges by battling, collecting, and trading.</p>
        </div>

        {/* Progress overview */}
        <div className="mb-8 rounded-2xl border border-white/5 p-6"
          style={{ background: 'linear-gradient(160deg,rgba(234,179,8,0.08),#0d0d16)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-black text-yellow-400">{unlocked} <span className="text-xl text-gray-400">/ {total}</span></p>
              <p className="text-gray-500 text-sm">achievements unlocked</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-white">{pct}%</p>
              <p className="text-gray-500 text-sm">completion</p>
            </div>
          </div>
          <div className="h-3 rounded-full bg-black/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#d97706,#fbbf24,#f59e0b)', boxShadow: '0 0 12px rgba(234,179,8,0.5)' }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className="px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
            style={{
              background: activeCategory === 'all' ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderColor: activeCategory === 'all' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
              color: activeCategory === 'all' ? '#fff' : '#6b7280',
            }}
          >
            All
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, meta]) => {
            const catAchievements = byCategory[key] ?? [];
            const catUnlocked = catAchievements.filter(a => a.unlocked).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className="px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
                style={{
                  background: activeCategory === key ? `${meta.color}22` : 'transparent',
                  borderColor: activeCategory === key ? `${meta.color}66` : 'rgba(255,255,255,0.1)',
                  color: activeCategory === key ? meta.color : '#6b7280',
                }}
              >
                {meta.icon} {meta.label} {catUnlocked}/{catAchievements.length}
              </button>
            );
          })}
        </div>

        {/* Achievement grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((ach) => {
            const catMeta = CATEGORY_LABELS[ach.category] ?? { color: '#9ca3af', icon: '•', label: ach.category };
            return (
              <div
                key={ach.key}
                className="relative rounded-2xl border p-4 transition-all"
                style={{
                  borderColor: ach.unlocked ? `${catMeta.color}44` : 'rgba(255,255,255,0.05)',
                  background: ach.unlocked
                    ? `linear-gradient(135deg,${catMeta.color}12,#0d0d16)`
                    : 'rgba(255,255,255,0.02)',
                  opacity: ach.unlocked ? 1 : 0.55,
                  boxShadow: ach.unlocked ? `0 0 20px ${catMeta.color}18` : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: ach.unlocked ? `${catMeta.color}22` : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${ach.unlocked ? `${catMeta.color}44` : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {ach.unlocked ? ach.icon : '🔒'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm truncate" style={{ color: ach.unlocked ? '#fff' : '#4b5563' }}>
                      {ach.title}
                    </p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: ach.unlocked ? '#9ca3af' : '#374151' }}>
                      {ach.description}
                    </p>
                    {ach.unlocked && ach.unlocked_at && (
                      <p className="text-xs mt-1.5 font-semibold" style={{ color: catMeta.color }}>
                        {new Date(ach.unlocked_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {ach.unlocked && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ background: catMeta.color, color: '#000' }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
