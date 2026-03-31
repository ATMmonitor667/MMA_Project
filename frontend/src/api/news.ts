import client from './client';

export const getNews = async () => {
  const res = await client.get('/news');
  return res.data;
};
