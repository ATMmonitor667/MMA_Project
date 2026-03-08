import { Request, Response } from 'express';
import { createListing, getActiveListings, getListingById, updateListingStatus, getUserListings, completeTrade } from '../models/Trade';
import { getUserCollection } from '../models/Card';

export const listCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const { card_id, asking_price = 0, asking_card_id = null } = req.body;
    if (!card_id) { res.status(400).json({ success: false, message: 'card_id required' }); return; }

    // Verify card belongs to user
    const collection = await getUserCollection(userId);
    const owns = collection.find((c: any) => c.card_id === Number(card_id));
    if (!owns) { res.status(403).json({ success: false, message: 'You do not own this card' }); return; }

    const listing = await createListing({ seller_id: userId, card_id: Number(card_id), asking_price: Number(asking_price), asking_card_id, status: 'active' });
    res.status(201).json({ success: true, message: 'Card listed for trade', data: { listing } });
  } catch (error) {
    console.error('listCard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rarity, min_price, max_price, fighter_name } = req.query;
    const listings = await getActiveListings({
      rarity: rarity as string | undefined,
      min_price: min_price ? Number(min_price) : undefined,
      max_price: max_price ? Number(max_price) : undefined,
      fighter_name: fighter_name as string | undefined,
    });
    res.json({ success: true, data: { listings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const acceptTrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const { listingId } = req.params;
    const listing = await getListingById(Number(listingId));
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    if (listing.seller_id === userId) { res.status(400).json({ success: false, message: 'Cannot buy your own listing' }); return; }

    await completeTrade(Number(listingId), userId);
    res.json({ success: true, message: 'Trade completed successfully' });
  } catch (error: any) {
    console.error('acceptTrade error:', error);
    res.status(400).json({ success: false, message: error.message || 'Trade failed' });
  }
};

export const cancelListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

    const { listingId } = req.params;
    const listing = await getListingById(Number(listingId));
    if (!listing) { res.status(404).json({ success: false, message: 'Listing not found' }); return; }
    if (listing.seller_id !== userId) { res.status(403).json({ success: false, message: 'Not your listing' }); return; }

    await updateListingStatus(Number(listingId), 'cancelled');
    res.json({ success: true, message: 'Listing cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const myListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }
    const listings = await getUserListings(userId);
    res.json({ success: true, data: { listings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
