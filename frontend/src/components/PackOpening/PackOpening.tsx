import { useState } from 'react';
import type { FighterCard as FighterCardType } from '../../types';
import { RARITY_COLORS, RARITY_LABELS } from '../../types';

interface PackOpeningProps {
  cards: FighterCardType[];
  packName: string;
  onDone: () => void;
}

export default function PackOpening({ cards, packName, onDone }: PackOpeningProps) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);

  const revealNext = () => {
    if (current < cards.length) {
      setRevealed(prev => [...prev, current]);
      setCurrent(prev => prev + 1);
      if (current + 1 === cards.length) setAllRevealed(true);
    }
  };

  const revealAll = () => {
    setRevealed(cards.map((_, i) => i));
    setCurrent(cards.length);
    setAllRevealed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-black text-yellow-400 mb-2">📦 {packName}</h2>
      <p className="text-gray-400 mb-6">{allRevealed ? 'All cards revealed!' : `${revealed.length}/${cards.length} revealed`}</p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {cards.map((card, i) => {
          const isRevealed = revealed.includes(i);
          const color = RARITY_COLORS[card.rarity];
          return (
            <div
              key={i}
              className="w-36 h-52 rounded-xl border-2 cursor-pointer transition-all duration-500"
              style={{
                borderColor: isRevealed ? color : '#374151',
                background: isRevealed
                  ? `linear-gradient(135deg, ${color}33, #111)`
                  : 'linear-gradient(135deg, #1f2937, #111827)',
                boxShadow: isRevealed ? `0 0 20px ${color}66` : 'none',
                transform: isRevealed ? 'scale(1.05)' : 'scale(1)',
              }}
              onClick={() => !isRevealed && i === current && revealNext()}
            >
              {isRevealed ? (
                <div className="h-full flex flex-col items-center justify-center p-2 text-center">
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-full text-black mb-2"
                    style={{ backgroundColor: color }}
                  >
                    {RARITY_LABELS[card.rarity]}
                  </span>
                  <div className="text-3xl mb-2">🥊</div>
                  <p className="text-white text-xs font-bold leading-tight">{card.first_name} {card.last_name}</p>
                  <p className="text-gray-400 text-xs mt-1">CP {card.combat_power}</p>
                  {card.signature_move && (
                    <p className="text-yellow-400 text-xs mt-1">⚡ Special!</p>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">❓</div>
                  {i === current ? (
                    <p className="text-yellow-400 text-xs animate-pulse">Tap to reveal</p>
                  ) : (
                    <p className="text-gray-600 text-xs">Waiting...</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4">
        {!allRevealed && (
          <>
            <button
              type="button"
              onClick={revealNext}
              className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors"
            >
              Reveal Next
            </button>
            <button
              type="button"
              onClick={revealAll}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
            >
              Reveal All
            </button>
          </>
        )}
        {allRevealed && (
          <button
            type="button"
            onClick={onDone}
            className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white text-lg font-black transition-colors"
          >
            Add to Collection ✓
          </button>
        )}
      </div>
    </div>
  );
}
