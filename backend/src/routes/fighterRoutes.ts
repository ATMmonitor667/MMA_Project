import { Router } from 'express';
import { getFighterCard } from '../controllers/getFighterCard';

const router = Router();


router.post('/fighters', getFighterCard);

export default router;