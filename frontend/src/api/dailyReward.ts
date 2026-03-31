import client from './client';

export const getDailyStatus = async () => {
  const res = await client.get('/daily-reward/status');
  return res.data;
};

export const claimDailyReward = async () => {
  const res = await client.post('/daily-reward/claim');
  return res.data;
};
