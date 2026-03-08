import pool from '../../config/db';

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'super_rare' | 'epic' | 'legendary' | 'ultra_rare';

export interface RarityWeights {
  common: number;
  uncommon: number;
  rare: number;
  super_rare: number;
  epic: number;
  legendary: number;
  ultra_rare: number;
}

export interface FighterCard {
  card_id?: number;
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
  created_at?: Date;
}

export interface UserCollection {
  collection_id?: number;
  user_id: number;
  card_id: number;
  acquired_at?: Date;
  is_for_trade: boolean;
  trade_price: number | null;
  is_in_deck: boolean;
}

export interface CardPack {
  pack_id?: number;
  name: string;
  description: string;
  cost_coins: number;
  cost_gems: number;
  rarity_weights: RarityWeights;
  cards_per_pack: number;
}

export const RARITY_MULTIPLIERS: Record<CardRarity, number> = {
  common: 1.0,
  uncommon: 1.15,
  rare: 1.3,
  super_rare: 1.5,
  epic: 1.75,
  legendary: 2.0,
  ultra_rare: 2.5,
};

export const RARITY_COLORS: Record<CardRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  super_rare: '#A855F7',
  epic: '#F97316',
  legendary: '#EAB308',
  ultra_rare: '#EF4444',
};

export const SIGNATURE_MOVES: string[] = [
  'Flying Knee', 'Rear Naked Choke', 'Head Kick KO', 'Guillotine Choke',
  'Triangle Choke', 'Spinning Heel Kick', 'Superman Punch', 'Anaconda Choke',
  'Kimura Lock', 'D\'Arce Choke', 'Double Leg Takedown', 'Body Triangle',
  'Overhand Right', 'Left Hook Combo', 'Ground and Pound', 'Heel Hook',
  'Armbar', 'Omoplata', 'Calf Slicer', 'Inverted Triangle',
];

export const PASSIVE_ABILITIES: string[] = [
  'Iron Chin: +10% durability in all rounds',
  'Cardio Machine: +5% to all stats in round 3',
  'Counter Striker: +15% power when losing',
  'Wrestling Base: +20% durability vs takedowns',
  'Southpaw Stance: +10% speed stat',
  'Pressure Fighter: +5% all stats each consecutive round won',
  'Glass Jaw: opponent -10% power but you deal +20% damage',
  'Veteran IQ: +15% IQ stat',
  'Explosive Starter: +20% all stats in round 1',
  'Submission Specialist: +25% IQ stat',
];

export async function createCardTables(): Promise<void> {
  const queries = [
    `CREATE TABLE IF NOT EXISTS fighter_card (
      card_id          SERIAL PRIMARY KEY,
      fighter_id       INT REFERENCES ufc_fighter(fighter_id),
      rarity           VARCHAR(20) NOT NULL,
      level            INT DEFAULT 1,
      xp               INT DEFAULT 0,
      combat_power     INT NOT NULL,
      power_stat       INT NOT NULL,
      speed_stat       INT NOT NULL,
      durability_stat  INT NOT NULL,
      iq_stat          INT NOT NULL,
      signature_move   TEXT NULL,
      passive_ability  TEXT NULL,
      card_art_variant INT DEFAULT 1,
      created_at       TIMESTAMPTZ DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS user_collection (
      collection_id SERIAL PRIMARY KEY,
      user_id       INT REFERENCES app_user(user_id) ON DELETE CASCADE,
      card_id       INT REFERENCES fighter_card(card_id) ON DELETE CASCADE,
      acquired_at   TIMESTAMPTZ DEFAULT now(),
      is_for_trade  BOOLEAN DEFAULT false,
      trade_price   INT NULL,
      is_in_deck    BOOLEAN DEFAULT false,
      UNIQUE(user_id, card_id)
    );`,
    `CREATE TABLE IF NOT EXISTS card_pack (
      pack_id        SERIAL PRIMARY KEY,
      name           VARCHAR(100) UNIQUE,
      description    TEXT,
      cost_coins     INT NOT NULL,
      cost_gems      INT NOT NULL,
      rarity_weights JSONB NOT NULL,
      cards_per_pack INT DEFAULT 5
    );`,
  ];
  for (const q of queries) {
    await pool.query(q);
  }
  console.log('Card tables created or already exist');
}

export async function seedCardPacks(): Promise<void> {
  const packs = [
    {
      name: 'Basic Pack',
      description: 'A starter pack with mostly common and uncommon fighters.',
      cost_coins: 1000,
      cost_gems: 50,
      rarity_weights: { common: 45, uncommon: 30, rare: 15, super_rare: 7, epic: 2.5, legendary: 0.4, ultra_rare: 0.1 },
      cards_per_pack: 5,
    },
    {
      name: 'Premium Pack',
      description: 'Higher chance of rare and super rare fighters.',
      cost_coins: 2500,
      cost_gems: 100,
      rarity_weights: { common: 20, uncommon: 25, rare: 28, super_rare: 18, epic: 6, legendary: 2.5, ultra_rare: 0.5 },
      cards_per_pack: 5,
    },
    {
      name: 'Elite Pack',
      description: 'Best chance at epic, legendary, and ultra rare cards.',
      cost_coins: 5000,
      cost_gems: 250,
      rarity_weights: { common: 5, uncommon: 10, rare: 20, super_rare: 25, epic: 22, legendary: 14, ultra_rare: 4 },
      cards_per_pack: 3,
    },
  ];

  for (const pack of packs) {
    await pool.query(
      `INSERT INTO card_pack (name, description, cost_coins, cost_gems, rarity_weights, cards_per_pack)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (name) DO NOTHING`,
      [pack.name, pack.description, pack.cost_coins, pack.cost_gems, JSON.stringify(pack.rarity_weights), pack.cards_per_pack]
    );
  }
  console.log('Card packs seeded');
}

export function rollRarity(weights: RarityWeights): CardRarity {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [rarity, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) return rarity as CardRarity;
  }
  return 'common';
}

export async function getRandomFighterId(): Promise<number> {
  const { rows } = await pool.query(
    `SELECT fighter_id FROM ufc_fighter
     WHERE fighter_id IN (SELECT fighter_id FROM ufc_weight_fighter)
     ORDER BY RANDOM() LIMIT 1`
  );
  return rows[0].fighter_id;
}

export async function generateCard(fighter_id: number, rarity: CardRarity): Promise<FighterCard> {
  const { rows } = await pool.query(
    'SELECT power, speed, durability, iq FROM ufc_weight_fighter WHERE fighter_id = $1',
    [fighter_id]
  );

  const baseStats = rows[0] || { power: 60, speed: 60, durability: 60, iq: 60 };
  const mult = RARITY_MULTIPLIERS[rarity];

  const power_stat = Math.min(99, Math.round(baseStats.power * mult));
  const speed_stat = Math.min(99, Math.round(baseStats.speed * mult));
  const durability_stat = Math.min(99, Math.round(baseStats.durability * mult));
  const iq_stat = Math.min(99, Math.round(baseStats.iq * mult));
  const combat_power = Math.round((power_stat + speed_stat + durability_stat + iq_stat) / 4);

  const signature_move =
    rarity === 'legendary' || rarity === 'ultra_rare'
      ? SIGNATURE_MOVES[Math.floor(Math.random() * SIGNATURE_MOVES.length)]
      : null;

  const passive_ability =
    rarity === 'ultra_rare'
      ? PASSIVE_ABILITIES[Math.floor(Math.random() * PASSIVE_ABILITIES.length)]
      : null;

  const card_art_variant = Math.floor(Math.random() * 3) + 1;

  const { rows: inserted } = await pool.query(
    `INSERT INTO fighter_card
       (fighter_id, rarity, level, xp, combat_power, power_stat, speed_stat, durability_stat, iq_stat, signature_move, passive_ability, card_art_variant)
     VALUES ($1, $2, 1, 0, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [fighter_id, rarity, combat_power, power_stat, speed_stat, durability_stat, iq_stat, signature_move, passive_ability, card_art_variant]
  );
  return inserted[0];
}

export async function createCard(card: Omit<FighterCard, 'card_id' | 'created_at'>): Promise<FighterCard> {
  const { rows } = await pool.query(
    `INSERT INTO fighter_card
       (fighter_id, rarity, level, xp, combat_power, power_stat, speed_stat, durability_stat, iq_stat, signature_move, passive_ability, card_art_variant)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [card.fighter_id, card.rarity, card.level, card.xp, card.combat_power,
     card.power_stat, card.speed_stat, card.durability_stat, card.iq_stat,
     card.signature_move, card.passive_ability, card.card_art_variant]
  );
  return rows[0];
}

export async function getCardById(card_id: number): Promise<FighterCard | null> {
  const { rows } = await pool.query('SELECT * FROM fighter_card WHERE card_id = $1', [card_id]);
  return rows[0] || null;
}

export async function getUserCollection(user_id: number): Promise<any[]> {
  const { rows } = await pool.query(
    `SELECT uc.collection_id, uc.user_id, uc.card_id, uc.acquired_at, uc.is_for_trade,
            uc.trade_price, uc.is_in_deck,
            fc.rarity, fc.level, fc.xp, fc.combat_power, fc.power_stat, fc.speed_stat,
            fc.durability_stat, fc.iq_stat, fc.signature_move, fc.passive_ability, fc.card_art_variant,
            uf.first_name, uf.last_name, uf.description
     FROM user_collection uc
     JOIN fighter_card fc ON uc.card_id = fc.card_id
     JOIN ufc_fighter uf ON fc.fighter_id = uf.fighter_id
     WHERE uc.user_id = $1
     ORDER BY fc.combat_power DESC`,
    [user_id]
  );
  return rows;
}

export async function addToCollection(user_id: number, card_id: number): Promise<UserCollection> {
  const { rows } = await pool.query(
    `INSERT INTO user_collection (user_id, card_id) VALUES ($1, $2)
     ON CONFLICT (user_id, card_id) DO UPDATE SET acquired_at = now()
     RETURNING *`,
    [user_id, card_id]
  );
  return rows[0];
}

export async function updateCollectionItem(
  collection_id: number,
  updates: Partial<UserCollection>
): Promise<UserCollection | null> {
  const fields = Object.keys(updates).filter(k => k !== 'collection_id' && k !== 'user_id' && k !== 'card_id');
  if (fields.length === 0) return null;
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = fields.map(f => (updates as any)[f]);
  const { rows } = await pool.query(
    `UPDATE user_collection SET ${setClause} WHERE collection_id = $1 RETURNING *`,
    [collection_id, ...values]
  );
  return rows[0] || null;
}

export async function getAllPacks(): Promise<CardPack[]> {
  const { rows } = await pool.query('SELECT * FROM card_pack ORDER BY cost_coins ASC');
  return rows;
}

export async function getPackById(pack_id: number): Promise<CardPack | null> {
  const { rows } = await pool.query('SELECT * FROM card_pack WHERE pack_id = $1', [pack_id]);
  return rows[0] || null;
}

export async function addXpToCard(card_id: number, xp_amount: number): Promise<FighterCard | null> {
  const card = await getCardById(card_id);
  if (!card) return null;

  let newXp = card.xp + xp_amount;
  let newLevel = card.level;
  let power = card.power_stat;
  let speed = card.speed_stat;
  let durability = card.durability_stat;
  let iq = card.iq_stat;

  const xpNeeded = 100 * newLevel;
  if (newXp >= xpNeeded && newLevel < 10) {
    newXp = newXp - xpNeeded;
    newLevel += 1;
    power = Math.min(99, Math.round(power * 1.08));
    speed = Math.min(99, Math.round(speed * 1.08));
    durability = Math.min(99, Math.round(durability * 1.08));
    iq = Math.min(99, Math.round(iq * 1.08));
  }

  const combat_power = Math.round((power + speed + durability + iq) / 4);

  const { rows } = await pool.query(
    `UPDATE fighter_card SET xp=$2, level=$3, power_stat=$4, speed_stat=$5, durability_stat=$6, iq_stat=$7, combat_power=$8
     WHERE card_id=$1 RETURNING *`,
    [card_id, newXp, newLevel, power, speed, durability, iq, combat_power]
  );
  return rows[0] || null;
}
