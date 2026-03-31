import { Request, Response } from 'express';
import { resolveBattle, saveBattle, getBattleHistory, getLeaderboard } from '../models/Battle';
import { getCardById, addXpToCard, getUserCollection, generateCard } from '../models/Card';
import { addCoins, getOrCreateWallet } from '../models/Wallet';
import { getUserStats, checkAndUnlock } from '../models/Achievement';

export const challenge = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const { my_card_id, opponent_card_id, battle_type = 'ai' } = req.body;
    if (!my_card_id) { res.status(400).json({ success: false, message: 'my_card_id required' }); return; }

    // Verify challenger owns the card
    const collection = await getUserCollection(userId);
    const owns = collection.find((c: any) => c.card_id === Number(my_card_id));
    if (!owns) { res.status(403).json({ success: false, message: 'You do not own this card' }); return; }

    const challengerCard = await getCardById(Number(my_card_id));
    if (!challengerCard) { res.status(404).json({ success: false, message: 'Your card not found' }); return; }

    let opponentCard: any;
    let opponentUserId: number | null = null;
    let opponentCardId: number | null = null;

    if (battle_type === 'ai' || !opponent_card_id) {
      // Generate a random AI opponent card based on challenger's combat power
      const { rows } = await require('../../config/db').default.query(
        `SELECT fighter_id FROM ufc_fighter
         WHERE fighter_id IN (SELECT fighter_id FROM ufc_weight_fighter)
         ORDER BY RANDOM() LIMIT 1`
      );
      const rarities = ['common', 'uncommon', 'rare', 'super_rare', 'epic'];
      const aiRarity = rarities[Math.floor(Math.random() * rarities.length)] as any;
      opponentCard = await generateCard(rows[0].fighter_id, aiRarity);
      opponentCardId = opponentCard.card_id;
    } else {
      opponentCard = await getCardById(Number(opponent_card_id));
      if (!opponentCard) { res.status(404).json({ success: false, message: 'Opponent card not found' }); return; }
      opponentCardId = opponentCard.card_id;
    }

    // Resolve battle
    const { rounds, winner } = resolveBattle(challengerCard, opponentCard);

    const isWinner = winner === 'challenger';
    const isDraw = winner === 'draw';

    const xpChallenger = isWinner ? 50 : isDraw ? 20 : 15;
    const xpOpponent = isWinner ? 15 : isDraw ? 20 : 50;
    const coinsWon = isWinner ? 100 : isDraw ? 30 : 0;

    const winnerId = isWinner ? userId : isDraw ? null : opponentUserId;

    // Save battle
    const battle = await saveBattle({
      challenger_id: userId,
      opponent_id: opponentUserId,
      challenger_card_id: Number(my_card_id),
      opponent_card_id: opponentCardId,
      winner_id: winnerId,
      rounds,
      xp_gained_challenger: xpChallenger,
      xp_gained_opponent: xpOpponent,
      coins_won: coinsWon,
      battle_type: battle_type === 'ai' ? 'ai' : 'pvp',
    });

    // Apply XP and coins
    await addXpToCard(Number(my_card_id), xpChallenger);
    if (coinsWon > 0) {
      await getOrCreateWallet(userId);
      await addCoins(userId, coinsWon);
    }

    // Check and unlock any newly earned achievements
    const stats = await getUserStats(userId);
    const newAchievements = await checkAndUnlock(userId, {
      ...stats as any,
      latestBattleRounds: rounds,
    });

    res.json({
      success: true,
      data: {
        battle,
        result: winner,
        rounds,
        xp_gained: xpChallenger,
        coins_won: coinsWon,
        challenger_card: challengerCard,
        opponent_card: opponentCard,
        new_achievements: newAchievements,
      },
    });
  } catch (error) {
    console.error('challenge error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const battleHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    const history = await getBattleHistory(userId);
    res.json({ success: true, data: { history } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const leaderboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const board = await getLeaderboard();
    res.json({ success: true, data: { leaderboard: board } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
