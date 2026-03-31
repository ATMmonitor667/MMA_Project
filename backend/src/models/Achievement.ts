import pool from '../../config/db';

export interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: 'battle' | 'collection' | 'trading' | 'progression' | 'loyalty';
  secret?: boolean;
}

export interface UserAchievement {
  achievement_key: string;
  unlocked_at: Date;
}

// All defined achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Battle
  { key: 'first_win',    title: 'First Blood',        description: 'Win your first battle',         icon: '🩸', category: 'battle' },
  { key: 'win_5',        title: 'On a Roll',           description: 'Win 5 battles',                 icon: '🔥', category: 'battle' },
  { key: 'win_25',       title: 'Veteran',             description: 'Win 25 battles',                icon: '⭐', category: 'battle' },
  { key: 'win_100',      title: 'Unstoppable',         description: 'Win 100 battles',               icon: '👑', category: 'battle' },
  { key: 'battle_10',    title: 'Fighter',             description: 'Fight 10 battles',              icon: '⚔',  category: 'battle' },
  { key: 'battle_50',    title: 'Seasoned Brawler',    description: 'Fight 50 battles',              icon: '🥊', category: 'battle' },
  { key: 'perfect_win',  title: 'Domination',          description: 'Win a battle 3-0',              icon: '💪', category: 'battle', secret: true },

  // Collection
  { key: 'first_card',   title: 'Got My First Card',   description: 'Add your first card',           icon: '🃏', category: 'collection' },
  { key: 'cards_10',     title: 'Building the Roster', description: 'Collect 10 cards',              icon: '📋', category: 'collection' },
  { key: 'cards_25',     title: 'Dedicated Collector', description: 'Collect 25 cards',              icon: '📚', category: 'collection' },
  { key: 'cards_50',     title: 'Card Hoarder',        description: 'Collect 50 cards',              icon: '🗄',  category: 'collection' },
  { key: 'first_pack',   title: 'Collector Begins',    description: 'Open your first pack',          icon: '📦', category: 'collection' },
  { key: 'packs_10',     title: 'Pack Addict',         description: 'Open 10 packs',                 icon: '🔓', category: 'collection' },
  { key: 'first_rare',   title: 'Going Rare',          description: 'Own a Rare card or better',     icon: '💎', category: 'collection' },
  { key: 'first_epic',   title: 'Epic Drop',           description: 'Own an Epic card or better',   icon: '🔮', category: 'collection' },
  { key: 'first_legendary', title: 'Legendary Holder', description: 'Own a Legendary card',         icon: '🌟', category: 'collection' },
  { key: 'first_ultra',  title: 'Ultra Exclusive',     description: 'Own an Ultra Rare card',        icon: '🏆', category: 'collection', secret: true },

  // Progression
  { key: 'level_5_card', title: 'Power Up',            description: 'Level a card to level 5',      icon: '⬆',  category: 'progression' },
  { key: 'max_card',     title: 'Maxed Out',           description: 'Level a card to max (10)',      icon: '💯', category: 'progression', secret: true },

  // Trading
  { key: 'first_trade',  title: 'Market Mover',        description: 'Complete your first trade',     icon: '🔄', category: 'trading' },
  { key: 'trades_5',     title: 'Deal Maker',          description: 'Complete 5 trades',             icon: '🤝', category: 'trading' },

  // Loyalty
  { key: 'streak_3',    title: 'Returning Fighter',    description: 'Log in 3 days in a row',        icon: '📅', category: 'loyalty' },
  { key: 'streak_7',    title: 'Week Warrior',         description: 'Maintain a 7-day login streak', icon: '🗓',  category: 'loyalty' },
];

export async function createAchievementTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_achievement (
      achievement_id SERIAL PRIMARY KEY,
      user_id        INT REFERENCES app_user(user_id) ON DELETE CASCADE,
      achievement_key VARCHAR(50) NOT NULL,
      unlocked_at    TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, achievement_key)
    );
  `);
}

export async function getUserAchievements(user_id: number): Promise<UserAchievement[]> {
  const { rows } = await pool.query(
    'SELECT achievement_key, unlocked_at FROM user_achievement WHERE user_id = $1',
    [user_id]
  );
  return rows;
}

export async function unlockAchievement(user_id: number, key: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `INSERT INTO user_achievement (user_id, achievement_key)
     VALUES ($1, $2)
     ON CONFLICT (user_id, achievement_key) DO NOTHING`,
    [user_id, key]
  );
  return (rowCount ?? 0) > 0;
}

// Returns array of newly unlocked achievement keys
export async function checkAndUnlock(
  user_id: number,
  context: {
    totalBattles?: number;
    totalWins?: number;
    collectionSize?: number;
    packsOpened?: number;
    highestRarity?: string;
    highestCardLevel?: number;
    totalTrades?: number;
    loginStreak?: number;
    latestBattleRounds?: Array<{ winner: string }>;
  }
): Promise<Achievement[]> {
  const existing = await getUserAchievements(user_id);
  const unlockedKeys = new Set(existing.map(a => a.achievement_key));
  const newlyUnlocked: Achievement[] = [];

  const rarityOrder = ['common', 'uncommon', 'rare', 'super_rare', 'epic', 'legendary', 'ultra_rare'];

  async function tryUnlock(key: string) {
    if (unlockedKeys.has(key)) return;
    const granted = await unlockAchievement(user_id, key);
    if (granted) {
      const def = ACHIEVEMENTS.find(a => a.key === key);
      if (def) newlyUnlocked.push(def);
    }
  }

  const { totalWins = 0, totalBattles = 0, collectionSize = 0, packsOpened = 0,
    highestRarity, highestCardLevel = 0, totalTrades = 0, loginStreak = 0,
    latestBattleRounds } = context;

  // Battle achievements
  if (totalWins >= 1)   await tryUnlock('first_win');
  if (totalWins >= 5)   await tryUnlock('win_5');
  if (totalWins >= 25)  await tryUnlock('win_25');
  if (totalWins >= 100) await tryUnlock('win_100');
  if (totalBattles >= 1)  await tryUnlock('battle_10');
  if (totalBattles >= 50) await tryUnlock('battle_50');
  if (latestBattleRounds) {
    const wins = latestBattleRounds.filter(r => r.winner === 'challenger').length;
    if (wins === 3) await tryUnlock('perfect_win');
  }

  // Collection achievements
  if (collectionSize >= 1)  await tryUnlock('first_card');
  if (collectionSize >= 10) await tryUnlock('cards_10');
  if (collectionSize >= 25) await tryUnlock('cards_25');
  if (collectionSize >= 50) await tryUnlock('cards_50');
  if (packsOpened >= 1)     await tryUnlock('first_pack');
  if (packsOpened >= 10)    await tryUnlock('packs_10');

  if (highestRarity) {
    const idx = rarityOrder.indexOf(highestRarity);
    if (idx >= 2) await tryUnlock('first_rare');
    if (idx >= 4) await tryUnlock('first_epic');
    if (idx >= 5) await tryUnlock('first_legendary');
    if (idx >= 6) await tryUnlock('first_ultra');
  }

  // Progression
  if (highestCardLevel >= 5)  await tryUnlock('level_5_card');
  if (highestCardLevel >= 10) await tryUnlock('max_card');

  // Trading
  if (totalTrades >= 1) await tryUnlock('first_trade');
  if (totalTrades >= 5) await tryUnlock('trades_5');

  // Loyalty
  if (loginStreak >= 3) await tryUnlock('streak_3');
  if (loginStreak >= 7) await tryUnlock('streak_7');

  return newlyUnlocked;
}

// Aggregate stats for a user to run achievement checks
export async function getUserStats(user_id: number): Promise<Record<string, number | string>> {
  const [battles, collection, trades, packs, streak] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(*) AS total_battles,
         SUM(CASE WHEN winner_id = $1 THEN 1 ELSE 0 END) AS total_wins
       FROM battle WHERE challenger_id = $1 OR opponent_id = $1`,
      [user_id]
    ),
    pool.query(
      `SELECT COUNT(*) AS total, MAX(fc.level) AS max_level,
              (SELECT fc2.rarity FROM user_collection uc2
               JOIN fighter_card fc2 ON uc2.card_id = fc2.card_id
               WHERE uc2.user_id = $1
               ORDER BY ARRAY_POSITION(
                 ARRAY['common','uncommon','rare','super_rare','epic','legendary','ultra_rare'],
                 fc2.rarity) DESC LIMIT 1) AS highest_rarity
       FROM user_collection uc
       JOIN fighter_card fc ON uc.card_id = fc.card_id
       WHERE uc.user_id = $1`,
      [user_id]
    ),
    pool.query(
      `SELECT COUNT(*) AS total FROM trade_listing
       WHERE seller_id = $1 AND status = 'completed'`,
      [user_id]
    ),
    // We don't track pack_opens separately yet — use collection size as proxy
    pool.query('SELECT COUNT(*) AS total FROM user_collection WHERE user_id = $1', [user_id]),
    pool.query('SELECT streak_count FROM daily_reward WHERE user_id = $1', [user_id]),
  ]);

  return {
    totalBattles: parseInt(battles.rows[0]?.total_battles ?? '0'),
    totalWins: parseInt(battles.rows[0]?.total_wins ?? '0'),
    collectionSize: parseInt(collection.rows[0]?.total ?? '0'),
    highestCardLevel: parseInt(collection.rows[0]?.max_level ?? '0'),
    highestRarity: collection.rows[0]?.highest_rarity ?? 'common',
    totalTrades: parseInt(trades.rows[0]?.total ?? '0'),
    packsOpened: Math.floor(parseInt(packs.rows[0]?.total ?? '0') / 5),
    loginStreak: parseInt(streak.rows[0]?.streak_count ?? '0'),
  };
}
