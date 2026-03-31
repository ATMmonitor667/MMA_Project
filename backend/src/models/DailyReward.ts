import pool from '../../config/db';
import { addCoins, addGems } from './Wallet';

export interface DailyRewardStatus {
  streak_count: number;
  last_claimed_at: Date | null;
  can_claim: boolean;
  next_reward: DailyRewardTier;
  hours_until_reset: number;
}

export interface DailyRewardTier {
  day: number;
  coins: number;
  gems: number;
  label: string;
}

export const DAILY_REWARD_TIERS: DailyRewardTier[] = [
  { day: 1, coins: 200,  gems: 0,  label: 'Day 1' },
  { day: 2, coins: 300,  gems: 0,  label: 'Day 2' },
  { day: 3, coins: 500,  gems: 5,  label: 'Day 3' },
  { day: 4, coins: 750,  gems: 5,  label: 'Day 4' },
  { day: 5, coins: 1000, gems: 10, label: 'Day 5' },
  { day: 6, coins: 1500, gems: 15, label: 'Day 6' },
  { day: 7, coins: 2000, gems: 25, label: 'Day 7 ★' },
];

export async function createDailyRewardTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_reward (
      reward_id      SERIAL PRIMARY KEY,
      user_id        INT UNIQUE REFERENCES app_user(user_id) ON DELETE CASCADE,
      streak_count   INT DEFAULT 0,
      last_claimed_at TIMESTAMPTZ NULL
    );
  `);
}

export async function getDailyRewardStatus(user_id: number): Promise<DailyRewardStatus> {
  const { rows } = await pool.query(
    'SELECT * FROM daily_reward WHERE user_id = $1',
    [user_id]
  );

  const record = rows[0];
  const now = new Date();

  let streak = record?.streak_count ?? 0;
  const lastClaimed: Date | null = record?.last_claimed_at ?? null;

  // Check if last claim was within 24h → cannot claim again
  // Check if last claim was more than 48h ago → streak resets
  let can_claim = true;
  let hoursUntilReset = 0;

  if (lastClaimed) {
    const hoursSinceClaim = (now.getTime() - lastClaimed.getTime()) / (1000 * 60 * 60);
    if (hoursSinceClaim < 24) {
      can_claim = false;
      hoursUntilReset = Math.ceil(24 - hoursSinceClaim);
    } else if (hoursSinceClaim >= 48) {
      // Missed a day — reset streak
      streak = 0;
    }
  }

  const nextDay = (streak % 7) + 1;
  const next_reward = DAILY_REWARD_TIERS[nextDay - 1];

  return {
    streak_count: streak,
    last_claimed_at: lastClaimed,
    can_claim,
    next_reward,
    hours_until_reset: hoursUntilReset,
  };
}

export async function claimDailyReward(user_id: number): Promise<{ reward: DailyRewardTier; new_streak: number }> {
  const status = await getDailyRewardStatus(user_id);
  if (!status.can_claim) {
    throw new Error(`Already claimed today. Try again in ${status.hours_until_reset}h`);
  }

  const newStreak = status.streak_count + 1;
  const dayIndex = ((newStreak - 1) % 7);
  const reward = DAILY_REWARD_TIERS[dayIndex];

  // Upsert reward record
  await pool.query(
    `INSERT INTO daily_reward (user_id, streak_count, last_claimed_at)
     VALUES ($1, $2, now())
     ON CONFLICT (user_id) DO UPDATE
       SET streak_count = $2, last_claimed_at = now()`,
    [user_id, newStreak]
  );

  // Grant coins and gems
  await addCoins(user_id, reward.coins);
  if (reward.gems > 0) {
    await addGems(user_id, reward.gems);
  }

  return { reward, new_streak: newStreak };
}
