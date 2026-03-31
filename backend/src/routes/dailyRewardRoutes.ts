import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getDailyStatus, claimDaily } from '../controllers/dailyRewardController';

const router = Router();

router.get('/daily-reward/status', authenticate, getDailyStatus);
router.post('/daily-reward/claim', authenticate, claimDaily);

export default router;
