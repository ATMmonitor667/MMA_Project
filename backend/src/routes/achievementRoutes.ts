import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getAchievements, checkAchievements } from '../controllers/achievementController';

const router = Router();

router.get('/achievements', authenticate, getAchievements);
router.post('/achievements/check', authenticate, checkAchievements);

export default router;
