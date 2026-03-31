import { Request, Response } from 'express';
import { ACHIEVEMENTS, getUserAchievements, getUserStats, checkAndUnlock } from '../models/Achievement';

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const userUnlocks = await getUserAchievements(userId);
    const unlockedMap = new Map(userUnlocks.map(u => [u.achievement_key, u.unlocked_at]));

    const enriched = ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: unlockedMap.has(a.key),
      unlocked_at: unlockedMap.get(a.key) ?? null,
      // Hide secret achievement details until unlocked
      description: a.secret && !unlockedMap.has(a.key) ? '???' : a.description,
      title: a.secret && !unlockedMap.has(a.key) ? '???' : a.title,
    }));

    const byCategory: Record<string, typeof enriched> = {};
    for (const a of enriched) {
      if (!byCategory[a.category]) byCategory[a.category] = [];
      byCategory[a.category].push(a);
    }

    res.json({
      success: true,
      data: {
        achievements: enriched,
        byCategory,
        total: ACHIEVEMENTS.length,
        unlocked: userUnlocks.length,
      },
    });
  } catch (error) {
    console.error('getAchievements error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const checkAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const stats = await getUserStats(userId);
    const newlyUnlocked = await checkAndUnlock(userId, stats as any);

    res.json({ success: true, data: { newlyUnlocked } });
  } catch (error) {
    console.error('checkAchievements error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
