import { Request, Response } from 'express';
import {
  getPackById, rollRarity, generateCard, addToCollection, getUserCollection, getAllPacks, getRandomFighterId,
} from '../models/Card';
import { getOrCreateWallet, deductCoins, deductGems } from '../models/Wallet';

export const openPack = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const { pack_id, currency = 'coins' } = req.body;
    if (!pack_id) { res.status(400).json({ success: false, message: 'pack_id required' }); return; }

    const pack = await getPackById(Number(pack_id));
    if (!pack) { res.status(404).json({ success: false, message: 'Pack not found' }); return; }

    const wallet = await getOrCreateWallet(userId);

    if (currency === 'gems') {
      if (wallet.gems < pack.cost_gems) {
        res.status(400).json({ success: false, message: `Not enough gems. Need ${pack.cost_gems}, have ${wallet.gems}` });
        return;
      }
      await deductGems(userId, pack.cost_gems);
    } else {
      if (wallet.coins < pack.cost_coins) {
        res.status(400).json({ success: false, message: `Not enough coins. Need ${pack.cost_coins}, have ${wallet.coins}` });
        return;
      }
      await deductCoins(userId, pack.cost_coins);
    }

    const newCards = [];
    for (let i = 0; i < pack.cards_per_pack; i++) {
      const rarity = rollRarity(pack.rarity_weights as any);
      const fighterId = await getRandomFighterId();
      const card = await generateCard(fighterId, rarity);
      await addToCollection(userId, card.card_id!);
      newCards.push(card);
    }

    res.json({ success: true, message: `Opened ${pack.name}!`, data: { cards: newCards, pack } });
  } catch (error: any) {
    console.error('openPack error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const getCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    const collection = await getUserCollection(userId);
    res.json({ success: true, data: { collection } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPublicCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const collection = await getUserCollection(Number(userId));
    res.json({ success: true, data: { collection } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPacks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const packs = await getAllPacks();
    res.json({ success: true, data: { packs } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
