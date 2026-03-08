import pool from '../../config/db';

export interface Wallet {
  wallet_id?: number;
  user_id: number;
  coins: number;
  gems: number;
  last_updated?: Date;
}

export async function createWalletTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS user_wallet (
      wallet_id    SERIAL PRIMARY KEY,
      user_id      INT REFERENCES app_user(user_id) ON DELETE CASCADE UNIQUE,
      coins        INT DEFAULT 1000,
      gems         INT DEFAULT 50,
      last_updated TIMESTAMPTZ DEFAULT now()
    );
  `;
  try {
    await pool.query(query);
    console.log('user_wallet table created or already exists');
  } catch (error) {
    console.error('Error creating user_wallet table:', error);
    throw error;
  }
}

export async function getWallet(user_id: number): Promise<Wallet | null> {
  const { rows } = await pool.query('SELECT * FROM user_wallet WHERE user_id = $1', [user_id]);
  return rows[0] || null;
}

export async function createWallet(user_id: number): Promise<Wallet> {
  const { rows } = await pool.query(
    'INSERT INTO user_wallet (user_id, coins, gems) VALUES ($1, 1000, 50) RETURNING *',
    [user_id]
  );
  return rows[0];
}

export async function getOrCreateWallet(user_id: number): Promise<Wallet> {
  const existing = await getWallet(user_id);
  if (existing) return existing;
  return createWallet(user_id);
}

export async function addCoins(user_id: number, amount: number): Promise<Wallet | null> {
  const { rows } = await pool.query(
    'UPDATE user_wallet SET coins = coins + $2, last_updated = now() WHERE user_id = $1 RETURNING *',
    [user_id, amount]
  );
  return rows[0] || null;
}

export async function deductCoins(user_id: number, amount: number): Promise<Wallet | null> {
  const wallet = await getWallet(user_id);
  if (!wallet || wallet.coins < amount) throw new Error('Insufficient coins');
  const { rows } = await pool.query(
    'UPDATE user_wallet SET coins = coins - $2, last_updated = now() WHERE user_id = $1 RETURNING *',
    [user_id, amount]
  );
  return rows[0] || null;
}

export async function addGems(user_id: number, amount: number): Promise<Wallet | null> {
  const { rows } = await pool.query(
    'UPDATE user_wallet SET gems = gems + $2, last_updated = now() WHERE user_id = $1 RETURNING *',
    [user_id, amount]
  );
  return rows[0] || null;
}

export async function deductGems(user_id: number, amount: number): Promise<Wallet | null> {
  const wallet = await getWallet(user_id);
  if (!wallet || wallet.gems < amount) throw new Error('Insufficient gems');
  const { rows } = await pool.query(
    'UPDATE user_wallet SET gems = gems - $2, last_updated = now() WHERE user_id = $1 RETURNING *',
    [user_id, amount]
  );
  return rows[0] || null;
}
