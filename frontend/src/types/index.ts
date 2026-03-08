export type CardRarity = 'common' | 'uncommon' | 'rare' | 'super_rare' | 'epic' | 'legendary' | 'ultra_rare';

export interface FighterCard {
  card_id: number;
  fighter_id: number;
  rarity: CardRarity;
  level: number;
  xp: number;
  combat_power: number;
  power_stat: number;
  speed_stat: number;
  durability_stat: number;
  iq_stat: number;
  signature_move: string | null;
  passive_ability: string | null;
  card_art_variant: number;
  created_at: string;
  first_name: string;
  last_name: string;
  description: string | null;
  imgUrl?: string;
}

export interface CollectionItem extends FighterCard {
  collection_id: number;
  user_id: number;
  acquired_at: string;
  is_for_trade: boolean;
  trade_price: number | null;
  is_in_deck: boolean;
}

export interface CardPack {
  pack_id: number;
  name: string;
  description: string;
  cost_coins: number;
  cost_gems: number;
  rarity_weights: Record<string, number>;
  cards_per_pack: number;
}

export interface TradeListing {
  listing_id: number;
  seller_id: number;
  seller_username?: string;
  card_id: number;
  asking_price: number;
  asking_card_id: number | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  rarity?: CardRarity;
  level?: number;
  combat_power?: number;
  first_name?: string;
  last_name?: string;
  power_stat?: number;
  speed_stat?: number;
  durability_stat?: number;
  iq_stat?: number;
}

export interface BattleRound {
  round: number;
  stat_used: string;
  challenger_value: number;
  opponent_value: number;
  winner: 'challenger' | 'opponent' | 'draw';
}

export interface BattleRecord {
  battle_id: number;
  challenger_id: number;
  opponent_id: number | null;
  challenger_card_id: number;
  opponent_card_id: number | null;
  winner_id: number | null;
  rounds: BattleRound[];
  xp_gained_challenger: number;
  xp_gained_opponent: number;
  coins_won: number;
  battle_type: 'pvp' | 'ai';
  created_at: string;
}

export interface Wallet {
  wallet_id: number;
  user_id: number;
  coins: number;
  gems: number;
  last_updated: string;
}

export interface User {
  user_id: number;
  username: string;
  email: string;
  display_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  total_battles: string;
  wins: string;
  losses: string;
  win_rate: string;
}

export const RARITY_COLORS: Record<CardRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  super_rare: '#A855F7',
  epic: '#F97316',
  legendary: '#EAB308',
  ultra_rare: '#EF4444',
};

export const RARITY_LABELS: Record<CardRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  super_rare: 'Super Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  ultra_rare: 'Ultra Rare',
};

export const RARITY_BORDER: Record<CardRarity, string> = {
  common: 'border-gray-400',
  uncommon: 'border-green-400',
  rare: 'border-blue-400',
  super_rare: 'border-purple-500',
  epic: 'border-orange-400',
  legendary: 'border-yellow-400',
  ultra_rare: 'border-red-500',
};

export const RARITY_GLOW: Record<CardRarity, string> = {
  common: 'shadow-gray-400/50',
  uncommon: 'shadow-green-400/50',
  rare: 'shadow-blue-400/50',
  super_rare: 'shadow-purple-500/50',
  epic: 'shadow-orange-400/50',
  legendary: 'shadow-yellow-400/60',
  ultra_rare: 'shadow-red-500/60',
};

export const RARITY_BG: Record<CardRarity, string> = {
  common: 'from-gray-700 to-gray-900',
  uncommon: 'from-green-900 to-gray-900',
  rare: 'from-blue-900 to-gray-900',
  super_rare: 'from-purple-900 to-gray-900',
  epic: 'from-orange-900 to-gray-900',
  legendary: 'from-yellow-900 to-gray-900',
  ultra_rare: 'from-red-900 to-gray-900',
};
