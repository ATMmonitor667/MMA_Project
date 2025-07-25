import { Router } from 'express';
import { getFighterCard } from '../controllers/getFighterCard';

const router = Router();


router.post('/fighters/card', getFighterCard);

export default router;