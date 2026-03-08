import { Router } from 'express';
import { listCard, getListings, acceptTrade, cancelListing, myListings } from '../controllers/tradeController';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/trade/listings', getListings);
router.post('/trade/list', authenticate, requireAuth, listCard);
router.put('/trade/accept/:listingId', authenticate, requireAuth, acceptTrade);
router.delete('/trade/cancel/:listingId', authenticate, requireAuth, cancelListing);
router.get('/trade/my-listings', authenticate, requireAuth, myListings);

export default router;
