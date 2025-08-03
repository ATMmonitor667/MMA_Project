import React from 'react';
import { cn } from '@/lib/utils';

interface FighterCardProps {
  fighter: {
    first_name: string;
    last_name: string;
    description?: string;
    power: number;
    speed: number;
    durability: number;
    iq: number;
    image?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'ultra-rare' | 'legendary';
  };
  className?: string;
  style?: React.CSSProperties;
}

const rarityStyles = {
  common: {
    borderColor: 'border-common',
    glowColor: 'common-glow',
    bgGradient: 'from-common/20 via-common/10 to-transparent',
    textColor: 'text-common',
    starColor: 'text-common-glow'
  },
  rare: {
    borderColor: 'border-rare',
    glowColor: 'rare-glow',
    bgGradient: 'from-rare/20 via-rare/10 to-transparent',
    textColor: 'text-rare',
    starColor: 'text-rare-glow'
  },
  epic: {
    borderColor: 'border-epic',
    glowColor: 'epic-glow',
    bgGradient: 'from-epic/20 via-epic/10 to-transparent',
    textColor: 'text-epic',
    starColor: 'text-epic-glow'
  },
  'ultra-rare': {
    borderColor: 'border-ultra-rare',
    glowColor: 'ultra-rare-glow',
    bgGradient: 'from-ultra-rare/20 via-ultra-rare/10 to-transparent',
    textColor: 'text-ultra-rare',
    starColor: 'text-ultra-rare-glow'
  },
  legendary: {
    borderColor: 'border-legendary',
    glowColor: 'legendary-glow',
    bgGradient: 'from-legendary/20 via-legendary/10 to-transparent',
    textColor: 'text-legendary',
    starColor: 'text-legendary-glow'
  }
};

const FighterCard: React.FC<FighterCardProps> = ({ fighter, className, style }) => {
  const {
    first_name,
    last_name,
    power,
    speed,
    durability,
    iq,
    image,
    rarity = 'legendary'
  } = fighter;

  const styles = rarityStyles[rarity];
  const fullName = `${first_name} ${last_name}`;

  return (
    <div className={cn("group perspective-1000", className)} style={style}>
      <div
        className={cn(
          // Base card styles
          "relative w-96 h-[600px] rounded-xl p-4",
          "bg-gradient-to-br from-card via-card/90 to-card/80",
          "border-4 transition-all duration-500",
          "shadow-2xl hover:shadow-4xl",
          "transform-gpu will-change-transform",
          "hover:scale-105 hover:rotate-y-12",

          // Rarity-specific border and glow
          styles.borderColor,

          // Hover animations
          "hover:animate-pulse-glow",
          "hover:shadow-[0_0_40px_currentColor]",

          // Holographic effect for legendary
          rarity === 'legendary' && [
            "before:absolute before:inset-0 before:rounded-xl",
            "before:bg-gradient-to-br before:from-transparent before:via-legendary/10 before:to-legendary/20",
            "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
            "hover:before:animate-holographic"
          ]
        )}
        style={{
          color: `hsl(var(--${styles.glowColor}))`
        }}
      >
        {/* Holographic overlay for legendary cards */}
        {rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 via-purple-500/20 to-red-500/20 animate-holographic" />
        )}

        {/* Card Header */}
        <div className="relative z-10 text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={cn("text-2xl animate-twinkle", styles.starColor)}>★</span>
            <h2 className={cn(
              "text-2xl font-bold tracking-wide",
              styles.textColor,
              "drop-shadow-lg"
            )}>
              {fullName}
            </h2>
            <span className={cn(
              "text-2xl animate-twinkle",
              styles.starColor,
              "[animation-delay:800ms]"
            )}>★</span>
          </div>

          {/* Rarity Badge */}
          <div className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider",
            `bg-gradient-to-r ${styles.bgGradient}`,
            styles.textColor,
            "shadow-lg"
          )}>
            {rarity}
          </div>
        </div>

        {/* Fighter Image Container */}
        <div className={cn(
          "relative w-full h-80 rounded-lg mb-4 overflow-hidden",
          "bg-gradient-to-br from-card-foreground/5 to-card-foreground/10",
          "border-2",
          styles.borderColor,
          "shadow-inner",
          "group-hover:animate-float"
        )}>
          {/* Image glow effect */}
          <div className={cn(
            "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500",
            `bg-gradient-to-br ${styles.bgGradient}`,
            "animate-pulse-glow"
          )} />

          <img
            src={image || "/src/assets/fighter-placeholder.jpg"}
            alt={`${fullName} fighter card`}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Fighter Stats */}
        <div className={cn(
          "bg-gradient-to-br from-card-foreground/5 to-card-foreground/10",
          "rounded-lg p-4 border-2",
          styles.borderColor,
          "backdrop-blur-sm"
        )}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Power', value: power, icon: '⚡' },
              { label: 'Speed', value: speed, icon: '🏃' },
              { label: 'Durability', value: durability, icon: '🛡️' },
              { label: 'IQ', value: iq, icon: '🧠' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "group/stat relative p-3 rounded-lg",
                  "bg-gradient-to-br from-card via-card/80 to-card/60",
                  "border border-border/50",
                  "transition-all duration-300",
                  "hover:scale-105 hover:animate-stat-pulse",
                  "cursor-pointer"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div className="text-center">
                    <div className={cn("text-xs font-medium opacity-80", styles.textColor)}>
                      {stat.label}
                    </div>
                    <div className={cn("text-lg font-bold", styles.textColor)}>
                      {stat.value}
                    </div>
                  </div>
                </div>

                {/* Stat progress bar */}
                <div className="absolute bottom-1 left-2 right-2 h-1 bg-border/30 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-out",
                      `bg-gradient-to-r ${styles.bgGradient}`
                    )}
                    style={{
                      width: `${stat.value}%`,
                      animationDelay: `${500 + index * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card number/ID (bottom right) */}
        <div className={cn(
          "absolute bottom-2 right-2 text-xs opacity-50",
          styles.textColor
        )}>
          #{Math.random().toString(36).substr(2, 6).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default FighterCard;