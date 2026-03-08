import { Router } from 'express';
import { openPack, getCollection, getPublicCollection, getPacks } from '../controllers/packController';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/packs/open', authenticate, requireAuth, openPack);
router.get('/collection', authenticate, requireAuth, getCollection);
router.get('/collection/:userId', getPublicCollection);
router.get('/store/packs', getPacks);

export default router;
