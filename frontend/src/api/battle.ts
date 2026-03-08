import client from './client';

export const challengeBattle = async (myCardId: number, opponentCardId?: number, battleType: 'pvp' | 'ai' = 'ai') => {
  const res = await client.post('/battle/challenge', {
    my_card_id: myCardId,
    opponent_card_id: opponentCardId,
    battle_type: battleType,
  });
  return res.data;
};

export const getBattleHistory = async () => {
  const res = await client.get('/battle/history');
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await client.get('/battle/leaderboard');
  return res.data;
};
