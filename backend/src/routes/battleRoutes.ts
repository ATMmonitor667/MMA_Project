import { Router } from 'express';
import { challenge, battleHistory, leaderboard } from '../controllers/battleController';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/battle/challenge', authenticate, requireAuth, challenge);
router.get('/battle/history', authenticate, requireAuth, battleHistory);
router.get('/battle/leaderboard', leaderboard);

export default router;
