/**
 * Fighter Enrichment Service
 * Fetches real UFC fighter data from:
 *   1. api.octagon-api.com  — fighter image + basic profile
 *   2. ufcstats.com         — win/loss/draw record + physical stats
 * Results are cached in the ufc_fighter table for 7 days.
 */

import pool from '../../config/db';

export interface EnrichedFighter {
  fighter_id: number;
  first_name: string;
  last_name: string;
  description: string | null;
  img_url: string | null;
  wins: number | null;
  losses: number | null;
  draws: number | null;
  height: string | null;
  reach: string | null;
  stance: string | null;
  nationality: string | null;
  stats_updated_at: Date | null;
}

// Ensure enrichment columns exist (idempotent migration)
export async function migrateEnrichmentColumns(): Promise<void> {
  const cols = [
    'ADD COLUMN IF NOT EXISTS wins         INT NULL',
    'ADD COLUMN IF NOT EXISTS losses       INT NULL',
    'ADD COLUMN IF NOT EXISTS draws        INT NULL',
    'ADD COLUMN IF NOT EXISTS height       VARCHAR(20) NULL',
    'ADD COLUMN IF NOT EXISTS reach        VARCHAR(20) NULL',
    'ADD COLUMN IF NOT EXISTS stance       VARCHAR(20) NULL',
    'ADD COLUMN IF NOT EXISTS nationality  VARCHAR(50) NULL',
    'ADD COLUMN IF NOT EXISTS img_url      TEXT NULL',
    'ADD COLUMN IF NOT EXISTS stats_updated_at TIMESTAMPTZ NULL',
  ];
  for (const col of cols) {
    await pool.query(`ALTER TABLE ufc_fighter ${col}`).catch(() => {/* column may already exist */});
  }
}

async function fetchOctagonData(slug: string): Promise<Partial<EnrichedFighter> | null> {
  try {
    const res = await fetch(`https://api.octagon-api.com/fighter/${slug}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    return {
      img_url: data.imgUrl ?? null,
      wins: data.wins ?? null,
      losses: data.losses ?? null,
      draws: data.draws ?? null,
      height: data.height ?? null,
      reach: data.reach ?? null,
      stance: data.stance ?? null,
      nationality: data.nationality ?? data.hometown ?? null,
    };
  } catch {
    return null;
  }
}

async function fetchUfcStatsRecord(
  firstName: string,
  lastName: string
): Promise<{ wins: number; losses: number; draws: number; height: string; reach: string; stance: string } | null> {
  try {
    const initial = firstName.charAt(0).toLowerCase();
    const url = `http://www.ufcstats.com/statistics/fighters?char=${initial}&page=all`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const html = await res.text();

    // Parse rows from the HTML table
    const rowRegex = /<tr[^>]*class="[^"]*b-statistics__table-row[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const stripHtml = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();

    const fullLast = lastName.toLowerCase();
    const fullFirst = firstName.toLowerCase();

    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const rowHtml = match[1];
      const cells: string[] = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(stripHtml(cellMatch[1]));
      }
      // ufcstats columns: First, Last, Nickname, Ht, Wt, Reach, Stance, W, L, D, Belt
      if (cells.length >= 10) {
        const rowFirst = cells[0].toLowerCase();
        const rowLast = cells[1].toLowerCase();
        if (rowFirst.includes(fullFirst) && rowLast.includes(fullLast)) {
          return {
            wins: parseInt(cells[7]) || 0,
            losses: parseInt(cells[8]) || 0,
            draws: parseInt(cells[9]) || 0,
            height: cells[3] || '',
            reach: cells[5] || '',
            stance: cells[6] || '',
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function getEnrichedFighter(fighter_id: number): Promise<EnrichedFighter | null> {
  const { rows } = await pool.query('SELECT * FROM ufc_fighter WHERE fighter_id = $1', [fighter_id]);
  if (!rows[0]) return null;

  const fighter = rows[0];

  // Return cached if fresh (7 days)
  if (fighter.stats_updated_at) {
    const age = Date.now() - new Date(fighter.stats_updated_at).getTime();
    if (age < 7 * 24 * 60 * 60 * 1000) {
      return fighter as EnrichedFighter;
    }
  }

  // Fetch fresh data in parallel
  const slug = `${fighter.first_name}-${fighter.last_name}`.toLowerCase().replace(/\s+/g, '-');
  const [octagon, ufcStats] = await Promise.all([
    fetchOctagonData(slug),
    fetchUfcStatsRecord(fighter.first_name, fighter.last_name),
  ]);

  const merged = {
    img_url: octagon?.img_url ?? fighter.img_url ?? null,
    wins: ufcStats?.wins ?? octagon?.wins ?? fighter.wins ?? null,
    losses: ufcStats?.losses ?? octagon?.losses ?? fighter.losses ?? null,
    draws: ufcStats?.draws ?? octagon?.draws ?? fighter.draws ?? null,
    height: ufcStats?.height ?? octagon?.height ?? fighter.height ?? null,
    reach: ufcStats?.reach ?? octagon?.reach ?? fighter.reach ?? null,
    stance: ufcStats?.stance ?? octagon?.stance ?? fighter.stance ?? null,
    nationality: octagon?.nationality ?? fighter.nationality ?? null,
  };

  // Cache to DB
  await pool.query(
    `UPDATE ufc_fighter
     SET img_url=$2, wins=$3, losses=$4, draws=$5, height=$6,
         reach=$7, stance=$8, nationality=$9, stats_updated_at=now()
     WHERE fighter_id=$1`,
    [fighter_id, merged.img_url, merged.wins, merged.losses, merged.draws,
     merged.height, merged.reach, merged.stance, merged.nationality]
  );

  return { ...fighter, ...merged, stats_updated_at: new Date() } as EnrichedFighter;
}

export async function searchFighters(query: string, limit = 10): Promise<any[]> {
  const { rows } = await pool.query(
    `SELECT f.fighter_id, f.first_name, f.last_name, f.description, f.img_url,
            f.wins, f.losses, f.draws, f.stance,
            w.power, w.speed, w.durability, w.iq
     FROM ufc_fighter f
     LEFT JOIN ufc_weight_fighter w ON f.fighter_id = w.fighter_id
     WHERE LOWER(f.first_name || ' ' || f.last_name) LIKE $1
     ORDER BY f.first_name
     LIMIT $2`,
    [`%${query.toLowerCase()}%`, limit]
  );
  return rows;
}
