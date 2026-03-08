import { Request, Response } from 'express';
import { getOrCreateWallet } from '../models/Wallet';

export const getWallet = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    const wallet = await getOrCreateWallet(userId);
    res.json({ success: true, data: { wallet } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
