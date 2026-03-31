import { useState } from 'react';
import type { CollectionItem } from '../../types';
import { RARITY_COLORS, RARITY_LABELS } from '../../types';

interface FighterCardProps {
  card: CollectionItem;
  onClick?: () => void;
  showActions?: boolean;
  onTrade?: (card: CollectionItem) => void;
  onBattle?: (card: CollectionItem) => void;
  selected?: boolean;
}

const statIcons: Record<string, string> = { Power: '💥', Speed: '⚡', Durability: '🛡', IQ: '🧠' };

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="mb-2">
    <div className="flex justify-between items-center text-xs mb-1">
      <span className="text-gray-400 flex items-center gap-1">{statIcons[label]} {label}</span>
      <span className="font-black text-white tabular-nums">{value}</span>
    </div>
    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full stat-fill"
        style={{
          width: `${value}%`,
          background: value >= 80
            ? 'linear-gradient(90deg,#16a34a,#4ade80)'
            : value >= 60
            ? 'linear-gradient(90deg,#ca8a04,#fbbf24)'
            : 'linear-gradient(90deg,#dc2626,#f87171)',
          boxShadow: `0 0 8px ${value >= 80 ? '#4ade8088' : value >= 60 ? '#fbbf2488' : '#f8717188'}`,
        }}
      />
    </div>
  </div>
);

export default function FighterCard({ card, onClick, showActions, onTrade, onBattle, selected }: FighterCardProps) {
  const [flipped, setFlipped] = useState(false);
  const color = RARITY_COLORS[card.rarity];
  const label = RARITY_LABELS[card.rarity];
  const isUltra = card.rarity === 'ultra_rare';
  const isLegendary = card.rarity === 'legendary';
  const isEpic = card.rarity === 'epic';
  const xpNeeded = 100 * card.level;
  const xpPct = Math.min(100, (card.xp / xpNeeded) * 100);

  const handleClick = () => {
    if (onClick) onClick();
    else setFlipped(f => !f);
  };

  return (
    <div
      className={`card-scene w-48 h-72 cursor-pointer select-none transition-transform duration-200
        ${selected ? 'scale-110 drop-shadow-2xl' : 'hover:scale-105'}`}
      onClick={handleClick}
    >
      <div className={`card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>

        {/* ── FRONT ── */}
        <div
          className={`card-face w-48 h-72 rounded-2xl overflow-hidden relative
            ${isUltra ? 'p-0.5' : isLegendary ? 'p-0.5' : 'border-2'}`}
          style={{
            borderColor: isUltra || isLegendary ? undefined : color,
            background: isUltra
              ? 'linear-gradient(135deg,#ff0080,#ff8c00,#ffe600,#00ff80,#00cfff,#8000ff,#ff0080)'
              : isLegendary
              ? `linear-gradient(135deg,${color},#fff8dc,${color})`
              : undefined,
          }}
        >
          {/* Inner card surface */}
          <div
            className={`absolute inset-${isUltra || isLegendary ? '0.5' : '0'} rounded-2xl overflow-hidden flex flex-col`}
            style={{
              background: `linear-gradient(160deg, ${color}18 0%, #0d0d16 50%, ${color}08 100%)`,
            }}
          >
            {/* Scanlines for ultra rare */}
            {isUltra && <div className="scanlines absolute inset-0 z-10 pointer-events-none rounded-2xl" />}

            {/* Shimmer sweep */}
            {(isUltra || isLegendary || isEpic) && (
              <div className="shimmer absolute inset-0 z-10 pointer-events-none rounded-2xl" />
            )}

            {/* Header row */}
            <div className="flex justify-between items-center px-3 pt-2.5 pb-1 z-20 relative">
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full text-black tracking-wide shadow-lg"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}88` }}
              >
                {label}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(card.level)].slice(0, 5).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: color, opacity: 0.8 }} />
                ))}
                <span className="text-xs font-black ml-1" style={{ color }}>{card.level}</span>
              </div>
            </div>

            {/* Fighter image area */}
            <div className="relative mx-3 rounded-xl overflow-hidden flex-1 flex items-center justify-center"
              style={{ background: `radial-gradient(ellipse at center, ${color}22 0%, #000 80%)` }}
            >
              {card.imgUrl ? (
                <img src={card.imgUrl} alt={`${card.first_name} ${card.last_name}`}
                  className="h-full w-full object-contain drop-shadow-2xl" />
              ) : (
                <div className={`text-5xl ${isUltra || isLegendary ? 'float' : ''}`}>🥊</div>
              )}
              {/* CP badge */}
              <div
                className="absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-xs font-black text-black shadow-lg"
                style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
              >
                ⚡{card.combat_power}
              </div>
            </div>

            {/* Footer */}
            <div className="px-3 pb-2.5 pt-1.5 z-20 relative">
              <p className="font-black text-white text-sm leading-tight truncate">
                {card.first_name} <span style={{ color }}>{card.last_name}</span>
              </p>
              {/* XP bar */}
              <div className="mt-1.5">
                <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                  <span>XP</span><span>{card.xp}/{xpNeeded}</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${xpPct}%`, background: `linear-gradient(90deg,${color},${color}cc)` }} />
                </div>
              </div>
              <p className="text-center text-xs text-gray-600 mt-1.5">Tap to see stats →</p>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className={`card-face card-back w-48 h-72 rounded-2xl overflow-hidden relative
            ${isUltra || isLegendary ? 'p-0.5' : 'border-2'}`}
          style={{
            borderColor: isUltra || isLegendary ? undefined : color,
            background: isUltra
              ? 'linear-gradient(135deg,#ff0080,#ff8c00,#ffe600,#00ff80,#00cfff,#8000ff,#ff0080)'
              : isLegendary
              ? `linear-gradient(135deg,${color},#fff8dc,${color})`
              : undefined,
          }}
        >
          <div
            className="absolute inset-0.5 rounded-2xl flex flex-col p-3 gap-1"
            style={{ background: `linear-gradient(160deg,${color}18 0%,#0d0d16 50%,${color}08 100%)` }}
          >
            {(isUltra || isLegendary || isEpic) && (
              <div className="shimmer absolute inset-0 z-10 pointer-events-none rounded-2xl" />
            )}

            <p className="text-center font-black text-sm z-20 relative" style={{ color }}>
              {card.first_name} {card.last_name}
            </p>

            <div className="z-20 relative mt-1 flex-1">
              <StatBar label="Power" value={card.power_stat} color={color} />
              <StatBar label="Speed" value={card.speed_stat} color={color} />
              <StatBar label="Durability" value={card.durability_stat} color={color} />
              <StatBar label="IQ" value={card.iq_stat} color={color} />
            </div>

            {card.signature_move && (
              <div className="z-20 relative rounded-lg px-2 py-1.5 border"
                style={{ background: `${color}15`, borderColor: `${color}55` }}>
                <p className="text-xs font-black" style={{ color }}>⚡ {card.signature_move}</p>
              </div>
            )}
            {card.passive_ability && (
              <div className="z-20 relative rounded-lg px-2 py-1.5 bg-red-900/30 border border-red-600/40">
                <p className="text-xs text-red-300 leading-tight">🔥 {card.passive_ability}</p>
              </div>
            )}

            {showActions && (
              <div className="flex gap-1.5 mt-1 z-20 relative">
                {onBattle && (
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); onBattle(card); }}
                    className="flex-1 text-xs py-1.5 rounded-lg font-black transition-all hover:scale-105 active:scale-95"
                    style={{ background: `linear-gradient(135deg,#16a34a,#4ade80)`, color: '#000' }}
                  >⚔ Battle</button>
                )}
                {onTrade && !card.is_for_trade && (
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); onTrade(card); }}
                    className="flex-1 text-xs py-1.5 rounded-lg font-black transition-all hover:scale-105 active:scale-95"
                    style={{ background: `linear-gradient(135deg,#1d4ed8,#60a5fa)`, color: '#fff' }}
                  >🔄 Trade</button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Outer glow ring */}
      {selected && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `0 0 0 3px ${color}, 0 0 30px ${color}88` }} />
      )}
    </div>
  );
}
