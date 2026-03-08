import pool from '../../config/db';

export interface BattleRound {
  round: number;
  stat_used: string;
  challenger_value: number;
  opponent_value: number;
  winner: 'challenger' | 'opponent' | 'draw';
}

export interface BattleRecord {
  battle_id?: number;
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
  created_at?: Date;
}

export async function createBattleTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS battle (
      battle_id              SERIAL PRIMARY KEY,
      challenger_id          INT REFERENCES app_user(user_id) ON DELETE CASCADE,
      opponent_id            INT NULL REFERENCES app_user(user_id) ON DELETE SET NULL,
      challenger_card_id     INT REFERENCES fighter_card(card_id) ON DELETE CASCADE,
      opponent_card_id       INT NULL REFERENCES fighter_card(card_id) ON DELETE SET NULL,
      winner_id              INT NULL,
      rounds                 JSONB DEFAULT '[]',
      xp_gained_challenger   INT DEFAULT 0,
      xp_gained_opponent     INT DEFAULT 0,
      coins_won              INT DEFAULT 0,
      battle_type            VARCHAR(10) DEFAULT 'pvp',
      created_at             TIMESTAMPTZ DEFAULT now()
    );
  `;
  await pool.query(query);
  console.log('battle table created or already exists');
}

const STAT_KEYS = ['power_stat', 'speed_stat', 'durability_stat', 'iq_stat'];

export function resolveBattle(
  challengerCard: any,
  opponentCard: any
): { rounds: BattleRound[]; winner: 'challenger' | 'opponent' | 'draw' } {
  const rounds: BattleRound[] = [];
  let challengerWins = 0;
  let opponentWins = 0;

  for (let i = 1; i <= 3; i++) {
    const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
    const cVal = Math.round(challengerCard[stat] * (0.9 + Math.random() * 0.2));
    const oVal = Math.round(opponentCard[stat] * (0.9 + Math.random() * 0.2));

    let roundWinner: 'challenger' | 'opponent' | 'draw';
    if (cVal > oVal) { roundWinner = 'challenger'; challengerWins++; }
    else if (oVal > cVal) { roundWinner = 'opponent'; opponentWins++; }
    else { roundWinner = 'draw'; }

    rounds.push({ round: i, stat_used: stat.replace('_stat', ''), challenger_value: cVal, opponent_value: oVal, winner: roundWinner });
  }

  let winner: 'challenger' | 'opponent' | 'draw';
  if (challengerWins > opponentWins) winner = 'challenger';
  else if (opponentWins > challengerWins) winner = 'opponent';
  else winner = 'draw';

  return { rounds, winner };
}

export async function saveBattle(battle: Omit<BattleRecord, 'battle_id' | 'created_at'>): Promise<BattleRecord> {
  const { rows } = await pool.query(
    `INSERT INTO battle
       (challenger_id, opponent_id, challenger_card_id, opponent_card_id, winner_id,
        rounds, xp_gained_challenger, xp_gained_opponent, coins_won, battle_type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      battle.challenger_id, battle.opponent_id, battle.challenger_card_id,
      battle.opponent_card_id, battle.winner_id,
      JSON.stringify(battle.rounds),
      battle.xp_gained_challenger, battle.xp_gained_opponent,
      battle.coins_won, battle.battle_type,
    ]
  );
  return rows[0];
}

export async function getBattleHistory(user_id: number, limit = 20): Promise<any[]> {
  const { rows } = await pool.query(
    `SELECT b.*,
            cfc.rarity AS challenger_rarity, cfc.level AS challenger_level, cfc.combat_power AS challenger_cp,
            cuf.first_name AS challenger_fighter_first, cuf.last_name AS challenger_fighter_last,
            ofc.rarity AS opponent_rarity, ofc.level AS opponent_level, ofc.combat_power AS opponent_cp,
            ouf.first_name AS opponent_fighter_first, ouf.last_name AS opponent_fighter_last,
            cu.username AS challenger_username, ou.username AS opponent_username
     FROM battle b
     JOIN fighter_card cfc ON b.challenger_card_id = cfc.card_id
     JOIN ufc_fighter cuf ON cfc.fighter_id = cuf.fighter_id
     JOIN app_user cu ON b.challenger_id = cu.user_id
     LEFT JOIN fighter_card ofc ON b.opponent_card_id = ofc.card_id
     LEFT JOIN ufc_fighter ouf ON ofc.fighter_id = ouf.fighter_id
     LEFT JOIN app_user ou ON b.opponent_id = ou.user_id
     WHERE b.challenger_id = $1 OR b.opponent_id = $1
     ORDER BY b.created_at DESC
     LIMIT $2`,
    [user_id, limit]
  );
  return rows;
}

export async function getLeaderboard(limit = 20): Promise<any[]> {
  const { rows } = await pool.query(
    `SELECT
       u.user_id, u.username,
       COUNT(b.battle_id) AS total_battles,
       SUM(CASE WHEN b.winner_id = u.user_id THEN 1 ELSE 0 END) AS wins,
       SUM(CASE WHEN b.winner_id != u.user_id AND b.winner_id IS NOT NULL THEN 1 ELSE 0 END) AS losses,
       ROUND(
         CASE WHEN COUNT(b.battle_id) > 0
           THEN SUM(CASE WHEN b.winner_id = u.user_id THEN 1 ELSE 0 END)::numeric / COUNT(b.battle_id) * 100
           ELSE 0 END, 1
       ) AS win_rate
     FROM app_user u
     LEFT JOIN battle b ON (b.challenger_id = u.user_id OR b.opponent_id = u.user_id)
     GROUP BY u.user_id, u.username
     ORDER BY wins DESC, total_battles DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}
