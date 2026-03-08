import { useState } from 'react';
import { CollectionItem, RARITY_COLORS, RARITY_LABELS, RARITY_BORDER, RARITY_BG } from '../../types';

interface FighterCardProps {
  card: CollectionItem;
  onClick?: () => void;
  showActions?: boolean;
  onTrade?: (card: CollectionItem) => void;
  onBattle?: (card: CollectionItem) => void;
  selected?: boolean;
}

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-1">
    <div className="flex justify-between text-xs mb-0.5">
      <span className="text-gray-300">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all"
        style={{ width: `${value}%`, backgroundColor: value >= 80 ? '#22c55e' : value >= 60 ? '#eab308' : '#ef4444' }}
      />
    </div>
  </div>
);

export default function FighterCard({ card, onClick, showActions, onTrade, onBattle, selected }: FighterCardProps) {
  const [flipped, setFlipped] = useState(false);
  const rarityColor = RARITY_COLORS[card.rarity];
  const rarityLabel = RARITY_LABELS[card.rarity];
  const borderClass = RARITY_BORDER[card.rarity];
  const bgClass = RARITY_BG[card.rarity];

  const xpNeeded = 100 * card.level;
  const xpPercent = Math.min(100, (card.xp / xpNeeded) * 100);

  return (
    <div
      className={`relative w-52 cursor-pointer select-none ${selected ? 'ring-2 ring-white scale-105' : ''}`}
      style={{ perspective: '1000px' }}
      onClick={onClick || (() => setFlipped(!flipped))}
    >
      <div
        className="relative transition-transform duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div
          className={`w-52 rounded-xl border-2 ${borderClass} bg-gradient-to-b ${bgClass} p-3 shadow-xl`}
          style={{ backfaceVisibility: 'hidden', boxShadow: `0 0 18px ${rarityColor}55` }}
        >
          {/* Rarity badge */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-black" style={{ backgroundColor: rarityColor }}>
              {rarityLabel}
            </span>
            <span className="text-xs text-gray-300">LVL {card.level}</span>
          </div>

          {/* Fighter image placeholder */}
          <div
            className="w-full h-32 rounded-lg mb-2 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${rarityColor}22, #111)` }}
          >
            {card.imgUrl ? (
              <img src={card.imgUrl} alt={`${card.first_name} ${card.last_name}`} className="h-full object-contain" />
            ) : (
              <div className="text-4xl">🥊</div>
            )}
          </div>

          {/* Name */}
          <div className="text-center mb-2">
            <p className="font-bold text-white text-sm leading-tight">{card.first_name} {card.last_name}</p>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{card.description || 'Elite MMA Fighter'}</p>
          </div>

          {/* Combat Power */}
          <div className="flex justify-center mb-2">
            <div className="rounded-full px-3 py-0.5 text-sm font-black text-black" style={{ backgroundColor: rarityColor }}>
              CP {card.combat_power}
            </div>
          </div>

          {/* XP bar */}
          <div className="text-xs text-gray-400 mb-0.5">XP {card.xp}/{xpNeeded}</div>
          <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
            <div className="h-1 rounded-full bg-cyan-400" style={{ width: `${xpPercent}%` }} />
          </div>

          <p className="text-center text-xs text-gray-500">Tap to flip</p>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 w-52 rounded-xl border-2 ${borderClass} bg-gradient-to-b ${bgClass} p-3 shadow-xl`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: `0 0 18px ${rarityColor}55` }}
        >
          <p className="text-center font-bold text-white text-sm mb-2">{card.first_name} {card.last_name}</p>

          <StatBar label="Power" value={card.power_stat} />
          <StatBar label="Speed" value={card.speed_stat} />
          <StatBar label="Durability" value={card.durability_stat} />
          <StatBar label="IQ" value={card.iq_stat} />

          {card.signature_move && (
            <div className="mt-2 p-1.5 rounded bg-yellow-900/50 border border-yellow-600">
              <p className="text-xs text-yellow-300 font-bold">⚡ {card.signature_move}</p>
            </div>
          )}
          {card.passive_ability && (
            <div className="mt-1 p-1.5 rounded bg-red-900/50 border border-red-600">
              <p className="text-xs text-red-300">🔥 {card.passive_ability}</p>
            </div>
          )}

          {showActions && (
            <div className="flex gap-1 mt-2">
              {onBattle && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onBattle(card); }}
                  className="flex-1 text-xs py-1 rounded bg-green-600 hover:bg-green-500 text-white font-bold transition-colors"
                >
                  ⚔ Battle
                </button>
              )}
              {onTrade && !card.is_for_trade && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onTrade(card); }}
                  className="flex-1 text-xs py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
                >
                  🔄 Trade
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
