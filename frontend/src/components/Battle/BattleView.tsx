import { useState, useEffect } from 'react';
import type { BattleRound, FighterCard } from '../../types';
import { RARITY_COLORS, RARITY_LABELS } from '../../types';

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

function MiniCard({ card, side, highlight }: { card: FighterCard; side: 'challenger' | 'opponent'; highlight?: boolean }) {
  const color = RARITY_COLORS[card.rarity];
  return (
    <div
      className="relative rounded-2xl border-2 p-4 text-center w-40 transition-all duration-300"
      style={{
        borderColor: highlight ? color : `${color}66`,
        background: `linear-gradient(160deg, ${color}22, #0d0d16)`,
        boxShadow: highlight ? `0 0 30px ${color}66` : 'none',
        transform: highlight ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <span className="text-xs font-black px-2 py-0.5 rounded-full text-black mb-2 inline-block"
        style={{ backgroundColor: color }}>
        {RARITY_LABELS[card.rarity]}
      </span>
      <div className="text-4xl my-3">🥊</div>
      <p className="text-white text-sm font-black leading-tight">{card.first_name} {card.last_name}</p>
      <p className="text-gray-400 text-xs mt-1">CP {card.combat_power}</p>
      <p className="text-xs mt-1 font-bold" style={{ color }}>{side === 'challenger' ? 'YOU' : 'OPPONENT'}</p>
    </div>
  );
}

export default function BattleView({ result, rounds, challengerCard, opponentCard, xpGained, coinsWon, onClose }: BattleViewProps) {
  const [visibleRounds, setVisibleRounds] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (visibleRounds < rounds.length) {
      const t = setTimeout(() => setVisibleRounds(v => v + 1), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowResult(true), 300);
      return () => clearTimeout(t);
    }
  }, [visibleRounds, rounds.length]);

  const isWin = result === 'challenger';
  const isDraw = result === 'draw';

  const resultColor = isWin ? '#22c55e' : isDraw ? '#eab308' : '#ef4444';
  const resultText = isWin ? 'VICTORY!' : isDraw ? 'DRAW' : 'DEFEAT';
  const resultIcon = isWin ? '🏆' : isDraw ? '🤝' : '💀';

  const challengerRoundsWon = rounds.filter(r => r.winner === 'challenger').length;
  const opponentRoundsWon = rounds.filter(r => r.winner === 'opponent').length;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{ backdropFilter: 'blur(8px)' }}>

      {/* Radial glow backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{ background: resultColor }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Result header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 float">{resultIcon}</div>
          <h1 className="text-5xl font-black tracking-tighter" style={{ color: resultColor,
            textShadow: `0 0 40px ${resultColor}88` }}>
            {resultText}
          </h1>
        </div>

        {/* Fighters VS */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <MiniCard card={challengerCard} side="challenger" highlight={isWin} />
          <div className="text-center">
            <div className="text-3xl font-black text-white opacity-60 mb-2">VS</div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black" style={{ color: '#22c55e' }}>{challengerRoundsWon}</span>
              <span className="text-gray-600">—</span>
              <span className="text-xl font-black" style={{ color: '#ef4444' }}>{opponentRoundsWon}</span>
            </div>
          </div>
          <MiniCard card={opponentCard} side="opponent" highlight={result === 'opponent'} />
        </div>

        {/* Round by round */}
        <div className="rounded-2xl border border-white/5 overflow-hidden mb-6"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">Round Breakdown</p>
          </div>
          <div className="divide-y divide-white/5">
            {rounds.slice(0, visibleRounds).map((round) => {
              const cWon = round.winner === 'challenger';
              const rDraw = round.winner === 'draw';
              const rColor = cWon ? '#22c55e' : rDraw ? '#eab308' : '#ef4444';
              return (
                <div key={round.round} className="flex items-center gap-3 px-4 py-3"
                  style={{ animation: 'slideIn 0.4s ease-out' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                    style={{ background: `${rColor}22`, border: `1px solid ${rColor}44` }}>
                    R{round.round}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">{statLabel[round.stat_used] || round.stat_used}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-black tabular-nums ${cWon ? 'text-green-300' : 'text-gray-500'}`}>
                      {round.challenger_value}
                    </span>
                    <span className="text-gray-700">vs</span>
                    <span className={`font-black tabular-nums ${!cWon && !rDraw ? 'text-red-300' : 'text-gray-500'}`}>
                      {round.opponent_value}
                    </span>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-xs font-black" style={{ color: rColor }}>
                      {cWon ? 'WIN' : rDraw ? 'DRAW' : 'LOSS'}
                    </span>
                  </div>
                </div>
              );
            })}
            {visibleRounds < rounds.length && (
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs text-gray-600">Next round incoming...</span>
              </div>
            )}
          </div>
        </div>

        {/* Rewards */}
        {showResult && (
          <div className="flex gap-3 mb-6" style={{ animation: 'slideIn 0.5s ease-out' }}>
            <div className="flex-1 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">XP Gained</p>
              <p className="text-cyan-400 text-3xl font-black">+{xpGained}</p>
            </div>
            {coinsWon > 0 && (
              <div className="flex-1 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Coins Won</p>
                <p className="text-yellow-400 text-3xl font-black">+{coinsWon} 🪙</p>
              </div>
            )}
          </div>
        )}

        {showResult && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 rounded-xl font-black text-lg text-black transition-all hover:scale-105 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${resultColor}, ${resultColor}cc)`,
              boxShadow: `0 0 30px ${resultColor}44` }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
