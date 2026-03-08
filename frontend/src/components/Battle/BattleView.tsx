import { useState, useEffect } from 'react';
import { BattleRound, FighterCard, RARITY_COLORS, RARITY_LABELS } from '../../types';

interface BattleViewProps {
  result: 'challenger' | 'opponent' | 'draw';
  rounds: BattleRound[];
  challengerCard: FighterCard;
  opponentCard: FighterCard;
  xpGained: number;
  coinsWon: number;
  onClose: () => void;
}

const statLabel: Record<string, string> = {
  power: '💥 Power',
  speed: '⚡ Speed',
  durability: '🛡 Durability',
  iq: '🧠 IQ',
};

function MiniCard({ card, side }: { card: FighterCard; side: 'challenger' | 'opponent' }) {
  const color = RARITY_COLORS[card.rarity];
  return (
    <div
      className="rounded-xl border-2 p-3 text-center w-36"
      style={{ borderColor: color, background: `linear-gradient(135deg, ${color}22, #111)` }}
    >
      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-black" style={{ backgroundColor: color }}>
        {RARITY_LABELS[card.rarity]}
      </span>
      <div className="text-3xl my-2">🥊</div>
      <p className="text-white text-xs font-bold">{card.first_name} {card.last_name}</p>
      <p className="text-gray-400 text-xs">CP {card.combat_power}</p>
      <p className="text-gray-500 text-xs">{side === 'challenger' ? 'You' : 'Opponent'}</p>
    </div>
  );
}

export default function BattleView({ result, rounds, challengerCard, opponentCard, xpGained, coinsWon, onClose }: BattleViewProps) {
  const [visibleRounds, setVisibleRounds] = useState(0);

  useEffect(() => {
    if (visibleRounds < rounds.length) {
      const t = setTimeout(() => setVisibleRounds(v => v + 1), 700);
      return () => clearTimeout(t);
    }
  }, [visibleRounds, rounds.length]);

  const isWin = result === 'challenger';
  const isDraw = result === 'draw';

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Header */}
      <div className={`text-4xl font-black mb-2 ${isWin ? 'text-green-400' : isDraw ? 'text-yellow-400' : 'text-red-400'}`}>
        {isWin ? '🏆 VICTORY!' : isDraw ? '🤝 DRAW' : '💀 DEFEAT'}
      </div>

      {/* Cards */}
      <div className="flex items-center gap-6 mb-6">
        <MiniCard card={challengerCard} side="challenger" />
        <span className="text-3xl font-black text-gray-400">VS</span>
        <MiniCard card={opponentCard} side="opponent" />
      </div>

      {/* Rounds */}
      <div className="w-full max-w-md space-y-2 mb-6">
        {rounds.slice(0, visibleRounds).map((round) => {
          const challengerWon = round.winner === 'challenger';
          const isDraw = round.winner === 'draw';
          return (
            <div
              key={round.round}
              className={`rounded-lg p-3 border animate-fade-in ${
                challengerWon ? 'border-green-600 bg-green-900/30' : isDraw ? 'border-yellow-600 bg-yellow-900/30' : 'border-red-600 bg-red-900/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-bold">Round {round.round}</span>
                <span className="text-sm font-bold">{statLabel[round.stat_used] || round.stat_used}</span>
                <span className={`text-sm font-black ${challengerWon ? 'text-green-400' : isDraw ? 'text-yellow-400' : 'text-red-400'}`}>
                  {challengerWon ? 'You Win' : isDraw ? 'Draw' : 'Opponent Wins'}
                </span>
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span className={`font-bold ${challengerWon ? 'text-green-300' : 'text-gray-400'}`}>{round.challenger_value}</span>
                <span className="text-gray-600">vs</span>
                <span className={`font-bold ${!challengerWon && !isDraw ? 'text-red-300' : 'text-gray-400'}`}>{round.opponent_value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards */}
      {visibleRounds >= rounds.length && (
        <div className="flex gap-6 mb-6 text-center">
          <div className="bg-gray-800 rounded-xl px-6 py-3">
            <p className="text-gray-400 text-xs">XP Gained</p>
            <p className="text-cyan-400 text-2xl font-black">+{xpGained}</p>
          </div>
          {coinsWon > 0 && (
            <div className="bg-gray-800 rounded-xl px-6 py-3">
              <p className="text-gray-400 text-xs">Coins Won</p>
              <p className="text-yellow-400 text-2xl font-black">+{coinsWon} 🪙</p>
            </div>
          )}
        </div>
      )}

      {visibleRounds >= rounds.length && (
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-lg font-black transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}
