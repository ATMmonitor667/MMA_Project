import { Request, Response } from 'express';
import { pool } from '../../config/db';

export async function getFighterInfo(
  req: Request,
  res: Response
): Promise<Response | void> {
  const { firstName, lastName } = req.body;
  try {
    const {
      rows: idRows
    } = await pool.query(
      `SELECT fighter_id
         FROM ufc_fighter
        WHERE first_name = $1 AND last_name = $2`,
      [firstName, lastName]
    );

    if (idRows.length === 0) {
      return res.status(404).json({ error: 'Fighter not found' });
    }
    const fighterId = idRows[0].fighter_id;

    const {
      rows: infoRows
    } = await pool.query(
      `SELECT f.first_name,
              f.last_name,
              f.description,
              w.class_name,
              s.power, s.speed, s.durability, s.iq
         FROM ufc_fighter           AS f
         JOIN fighter_weight_class  AS s ON s.fighter_id      = f.fighter_id
         JOIN weight_classes        AS w ON w.weight_class_id = s.weight_class_id
        WHERE f.fighter_id = $1`,
      [fighterId]
    );

    return res.json(infoRows[0]);           // exactly one row expected
  } catch (err) {
    console.error('DB query failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}