import { Request, Response } from "express";
import pool from "../../config/db";




async function getFighterId(
  first: string,
  last: string
): Promise<number | null> {
  const { rows } = await pool.query<{ id: number }>(
    `
      SELECT id
      FROM   ufc_fighter
      WHERE  first_name = $1 AND last_name = $2
      LIMIT  1
    `,
    [first, last]
  );
  return rows[0]?.id ?? null;
}

export interface FighterStats {
  first_name: string;
  last_name: string;
  description: string | null;
  power: number;
  speed: number;
  durability: number;
  iq: number;
}

async function getFighterStats(
  first: string,
  last: string
): Promise<FighterStats | null> {
  const { rows } = await pool.query<FighterStats>(
    `
      SELECT  s.first_name,
              s.last_name,
              s.description,
              t.power,
              t.speed,
              t.durability,
              t.iq
      FROM    ufc_fighter AS s
      LEFT JOIN ufc_weight_fighter AS t
             ON s.fighter_id = t.fighter_id
      WHERE   s.first_name = $1
      AND     s.last_name  = $2
      LIMIT 1
    `,
    [first, last]
  );
  return rows[0] ?? null;
}

async function getFighterImage(slug: string): Promise<string | null> {
  const res = await fetch(`https://api.octagon-api.com/fighter/${slug}`);

  if (!res.ok) {
    console.error(`Octagon HTTP ${res.status}`);
    return null;
  }

  const { imgUrl } = (await res.json()) as { imgUrl?: string };
  return imgUrl ?? null;
}


export async function getFighterCard(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { firstName, lastName } = req.body as {
      firstName?: string;
      lastName?: string;
    };

    if (!firstName || !lastName) {
      res.status(400).json({ error: "firstName and lastName required" });
      return;
    }

    const [id, stats] = await Promise.all([
      getFighterId(firstName, lastName),
      getFighterStats(firstName, lastName),
    ]);

    if (!id || !stats) {
      res.status(404).json({ error: "Fighter not found" });
      return;
    }

    const slug = `${firstName}-${lastName}`.toLowerCase();
    const imgUrl = await getFighterImage(slug);

    res.json({
      id,
      name: `${stats.first_name} ${stats.last_name}`,
      description: stats.description,
      stats: {
        power: stats.power,
        speed: stats.speed,
        durability: stats.durability,
        iq: stats.iq,
      },
      imgUrl,
    });
  } catch (err) {
    console.error("getFighterCard failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}