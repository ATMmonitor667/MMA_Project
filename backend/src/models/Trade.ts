import pool from '../../config/db';
import { addCoins, deductCoins } from './Wallet';

export interface TradeListing {
  listing_id?: number;
  seller_id: number;
  card_id: number;
  asking_price: number;
  asking_card_id: number | null;
  status: 'active' | 'completed' | 'cancelled';
  created_at?: Date;
  updated_at?: Date;
}

export async function createTradeTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS trade_listing (
      listing_id     SERIAL PRIMARY KEY,
      seller_id      INT REFERENCES app_user(user_id) ON DELETE CASCADE,
      card_id        INT REFERENCES fighter_card(card_id) ON DELETE CASCADE,
      asking_price   INT DEFAULT 0,
      asking_card_id INT NULL REFERENCES fighter_card(card_id) ON DELETE SET NULL,
      status         VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
      created_at     TIMESTAMPTZ DEFAULT now(),
      updated_at     TIMESTAMPTZ DEFAULT now()
    );
  `;
  await pool.query(query);
  console.log('trade_listing table created or already exists');
}

export async function createListing(data: Omit<TradeListing, 'listing_id' | 'created_at' | 'updated_at'>): Promise<TradeListing> {
  const { rows } = await pool.query(
    `INSERT INTO trade_listing (seller_id, card_id, asking_price, asking_card_id, status)
     VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
    [data.seller_id, data.card_id, data.asking_price, data.asking_card_id]
  );
  return rows[0];
}

export async function getActiveListings(filters?: {
  rarity?: string;
  min_price?: number;
  max_price?: number;
  fighter_name?: string;
}): Promise<any[]> {
  let query = `
    SELECT tl.listing_id, tl.seller_id, tl.card_id, tl.asking_price, tl.asking_card_id,
           tl.status, tl.created_at,
           au.username AS seller_username,
           fc.rarity, fc.level, fc.combat_power, fc.power_stat, fc.speed_stat,
           fc.durability_stat, fc.iq_stat, fc.signature_move,
           uf.first_name, uf.last_name
    FROM trade_listing tl
    JOIN app_user au ON tl.seller_id = au.user_id
    JOIN fighter_card fc ON tl.card_id = fc.card_id
    JOIN ufc_fighter uf ON fc.fighter_id = uf.fighter_id
    WHERE tl.status = 'active'
  `;
  const params: any[] = [];
  let idx = 1;

  if (filters?.rarity) {
    query += ` AND fc.rarity = $${idx++}`;
    params.push(filters.rarity);
  }
  if (filters?.min_price !== undefined) {
    query += ` AND tl.asking_price >= $${idx++}`;
    params.push(filters.min_price);
  }
  if (filters?.max_price !== undefined) {
    query += ` AND tl.asking_price <= $${idx++}`;
    params.push(filters.max_price);
  }
  if (filters?.fighter_name) {
    query += ` AND (uf.first_name ILIKE $${idx} OR uf.last_name ILIKE $${idx})`;
    params.push(`%${filters.fighter_name}%`);
    idx++;
  }

  query += ' ORDER BY tl.created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getListingById(listing_id: number): Promise<TradeListing | null> {
  const { rows } = await pool.query('SELECT * FROM trade_listing WHERE listing_id = $1', [listing_id]);
  return rows[0] || null;
}

export async function updateListingStatus(listing_id: number, status: string): Promise<TradeListing | null> {
  const { rows } = await pool.query(
    `UPDATE trade_listing SET status = $2, updated_at = now() WHERE listing_id = $1 RETURNING *`,
    [listing_id, status]
  );
  return rows[0] || null;
}

export async function getUserListings(seller_id: number): Promise<any[]> {
  const { rows } = await pool.query(
    `SELECT tl.*, fc.rarity, fc.level, fc.combat_power, uf.first_name, uf.last_name
     FROM trade_listing tl
     JOIN fighter_card fc ON tl.card_id = fc.card_id
     JOIN ufc_fighter uf ON fc.fighter_id = uf.fighter_id
     WHERE tl.seller_id = $1
     ORDER BY tl.created_at DESC`,
    [seller_id]
  );
  return rows;
}

export async function completeTrade(listing_id: number, buyer_id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: listingRows } = await client.query(
      'SELECT * FROM trade_listing WHERE listing_id = $1 AND status = $2',
      [listing_id, 'active']
    );
    if (listingRows.length === 0) throw new Error('Listing not found or not active');

    const listing = listingRows[0];
    const price = listing.asking_price;

    if (price > 0) {
      await deductCoins(buyer_id, price);
      await addCoins(listing.seller_id, price);
    }

    await client.query(
      'UPDATE user_collection SET user_id = $1 WHERE card_id = $2',
      [buyer_id, listing.card_id]
    );

    await client.query(
      'UPDATE trade_listing SET status = $1, updated_at = now() WHERE listing_id = $2',
      ['completed', listing_id]
    );

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
