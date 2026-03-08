import { Router } from 'express';
import { getWallet } from '../controllers/walletController';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/wallet', authenticate, requireAuth, getWallet);

export default router;
