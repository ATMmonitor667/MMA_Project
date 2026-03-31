import client from './client';

export const getAchievements = async () => {
  const res = await client.get('/achievements');
  return res.data;
};

export const checkAchievements = async () => {
  const res = await client.post('/achievements/check');
  return res.data;
};
