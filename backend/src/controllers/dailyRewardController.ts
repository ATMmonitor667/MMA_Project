import { Request, Response } from 'express';
import { getDailyRewardStatus, claimDailyReward, DAILY_REWARD_TIERS } from '../models/DailyReward';
import { getOrCreateWallet } from '../models/Wallet';

export const getDailyStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    await getOrCreateWallet(userId);
    const status = await getDailyRewardStatus(userId);

    res.json({ success: true, data: { status, tiers: DAILY_REWARD_TIERS } });
  } catch (error) {
    console.error('getDailyStatus error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const claimDaily = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    await getOrCreateWallet(userId);
    const result = await claimDailyReward(userId);

    res.json({
      success: true,
      message: `Daily reward claimed! +${result.reward.coins} coins${result.reward.gems > 0 ? ` +${result.reward.gems} gems` : ''}`,
      data: result,
    });
  } catch (error: any) {
    const msg = error?.message || 'Internal server error';
    const status = msg.includes('Already claimed') ? 400 : 500;
    res.status(status).json({ success: false, message: msg });
  }
};
