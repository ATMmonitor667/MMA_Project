import client from './client';

export const getCollection = async (userId?: number) => {
  const url = userId ? `/collection/${userId}` : '/collection';
  const res = await client.get(url);
  return res.data;
};

export const openPack = async (packId: number, currency: 'coins' | 'gems') => {
  const res = await client.post('/packs/open', { pack_id: packId, currency });
  return res.data;
};

export const getAllPacks = async () => {
  const res = await client.get('/store/packs');
  return res.data;
};

export const getWallet = async () => {
  const res = await client.get('/wallet');
  return res.data;
};

export const getFighterCard = async (firstName: string, lastName: string) => {
  const res = await client.post('/fighters', { firstName, lastName });
  return res.data;
};
