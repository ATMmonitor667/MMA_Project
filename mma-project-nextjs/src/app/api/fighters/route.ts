import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

async function getFighterId(first: string, last: string): Promise<number | null> {
  const { rows } = await pool.query<{ id: number }>(
    `SELECT id FROM ufc_fighter WHERE first_name = $1 AND last_name = $2 LIMIT 1`,
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

async function getFighterStats(first: string, last: string): Promise<FighterStats | null> {
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
      LEFT JOIN ufc_weight_fighter AS t ON s.fighter_id = t.fighter_id
      WHERE   s.first_name = $1 AND s.last_name = $2
      LIMIT 1
    `,
    [first, last]
  );
  return rows[0] ?? null;
}

async function getFighterImage(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.octagon-api.com/fighter/${slug}`);
    if (!res.ok) {
      console.error(`Octagon HTTP ${res.status}`);
      return null;
    }
    const { imgUrl } = (await res.json()) as { imgUrl?: string };
    return imgUrl ?? null;
  } catch (error) {
    console.error('Error fetching fighter image:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "firstName and lastName required" },
        { status: 400 }
      );
    }

    const [id, stats] = await Promise.all([
      getFighterId(firstName, lastName),
      getFighterStats(firstName, lastName),
    ]);

    if (!id || !stats) {
      return NextResponse.json(
        { error: "Fighter not found" },
        { status: 404 }
      );
    }

    const slug = `${firstName}-${lastName}`.toLowerCase();
    const imgUrl = await getFighterImage(slug);

    return NextResponse.json({
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
  } catch (error) {
    console.error("getFighterCard failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
