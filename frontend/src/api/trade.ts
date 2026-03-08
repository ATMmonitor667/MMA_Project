import client from './client';

export const getListings = async (filters?: { rarity?: string; min_price?: number; max_price?: number; fighter_name?: string }) => {
  const res = await client.get('/trade/listings', { params: filters });
  return res.data;
};

export const createListing = async (cardId: number, askingPrice: number, askingCardId?: number) => {
  const res = await client.post('/trade/list', { card_id: cardId, asking_price: askingPrice, asking_card_id: askingCardId });
  return res.data;
};

export const acceptOffer = async (listingId: number) => {
  const res = await client.put(`/trade/accept/${listingId}`);
  return res.data;
};

export const cancelListing = async (listingId: number) => {
  const res = await client.delete(`/trade/cancel/${listingId}`);
  return res.data;
};

export const getMyListings = async () => {
  const res = await client.get('/trade/my-listings');
  return res.data;
};
