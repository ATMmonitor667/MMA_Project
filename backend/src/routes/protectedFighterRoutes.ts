import { Router } from 'express';
import { getFighterCard } from '../controllers/getFighterCard';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

// Protected fighter routes - requires authentication
router.post('/fighters', authenticate, requireAuth, getFighterCard);

export default router; 