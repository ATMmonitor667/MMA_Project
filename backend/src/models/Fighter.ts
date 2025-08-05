//This file was made assuming that the tables are already implmented and constructed to the best of my abilities
// i have divided the Fighter model into three different models for better organization and also as a way to practice
// SQL applications join tables and seperating information based on what is needed
import pool from '../../config/db';

/*
CREATE TABLE ufc_fighter (
    fighter_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    description TEXT,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weight_classes (
    weight_class_id SERIAL PRIMARY KEY,
    rank INTEGER NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    upper_limit_lbs INTEGER NOT NULL
);

CREATE TABLE ufc_weight_fighter (
    fighter_id INTEGER REFERENCES ufc_fighter(fighter_id) ON DELETE CASCADE,
    weight_class_id INTEGER REFERENCES weight_classes(weight_class_id) ON DELETE CASCADE,
    power INTEGER CHECK (power BETWEEN 0 AND 100),
    speed INTEGER CHECK (speed BETWEEN 0 AND 100),
    durability INTEGER CHECK (durability BETWEEN 0 AND 100),
    iq INTEGER CHECK (iq BETWEEN 0 AND 100),
    PRIMARY KEY (fighter_id, weight_class_id)
);

 */

export interface Fighter {
  fighter_id: number;
  first_name: string;
  last_name: string;
  description?: string | null;
  wins?: number;
  losses?: number;
  draws?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface WeightClass {
  weight_class_id: number;
  rank: number;
  class_name: string;
  upper_limit_lbs: number;
}

export interface FighterStats {
  fighter_id: number;
  weight_class_id: number;
  power: number;
  speed: number;
  durability: number;
  iq: number;
}
export interface FighterCard {
  fighter: Fighter;
  weight_class: WeightClass;
  stats: FighterStats;
}

export async function createTable(): Promise<void>
{
  const query = `
    CREATE TABLE IF NOT EXISTS ufc_fighter (
      fighter_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      description TEXT,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      draws INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS weight_classes (
      weight_class_id SERIAL PRIMARY KEY,
      rank INTEGER NOT NULL,
      class_name VARCHAR(100) NOT NULL,
      upper_limit_lbs INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ufc_weight_fighter (
      fighter_id INTEGER REFERENCES ufc_fighter(fighter_id) ON DELETE CASCADE,
      weight_class_id INTEGER REFERENCES weight_classes(weight_class_id) ON DELETE CASCADE,
      power INTEGER CHECK (power BETWEEN 0 AND 100),
      speed INTEGER CHECK (speed BETWEEN 0 AND 100),
      durability INTEGER CHECK (durability BETWEEN 0 AND 100),
      iq INTEGER CHECK (iq BETWEEN 0 AND 100),
      PRIMARY KEY (fighter_id, weight_class_id)
    );
  `;

  try {
    await pool.query(query);
    console.log('Fighter tables created or already exist');
  } catch (error) {
    console.error('Error creating fighter tables:', error);
    throw error;
  }

}

export async function findFighterById(fighterId: number): Promise<Fighter | void> {
  const query =
  `SELECT * FROM ufc_fighter
  WHERE fighter_id = $1`;
  try{
    const result = await pool.query<Fighter>(query, [fighterId]);
    if( result.rows.length === 0) {
      console.warn(`Fighter with ID ${fighterId} not found`);
      return;
    }
    return result.rows[0] || null;

  }
  catch(error){
    console.error('Error finding fighter by ID:', error);
    throw error;
  }
}

export async function getFighterCard(fighterId: number): Promise<FighterCard | null> {
  const query = `
    SELECT f.first_name, f.last_name, f.wins, f.losses, f.draws, w.class_name, s.power, s.speed, s.durability, s.iq
    FROM ufc_fighter AS f
    LEFT JOIN ufc_weight_fighter AS s ON f.fighter_id = s.fighter_id
    LEFT JOIN weight_classes AS w ON s.weight_class_id = w.weight_class_id
	  WHERE f.fighter_id = $1
    ORDER BY w.rank
  `;

  try {
    const { rows } = await pool.query<FighterCard>(query, [fighterId]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting fighter card:', error);
    throw error;
  }
}

export function getFighterImage(fighterId: number): Promise<string | null> {
  const query = `
    SELECT img_url FROM ufc_fighter_images
    WHERE fighter_id = $1
  `;

  return pool.query<{ img_url: string }>(query, [fighterId])
    .then(result => {
      if (result.rows.length > 0) {
        return result.rows[0].img_url;
      }
      return null;
    })
    .catch(error => {
      console.error('Error fetching fighter image:', error);
      throw error;
    });
}