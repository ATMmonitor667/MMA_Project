import { Router } from 'express';
import { getNews } from '../controllers/newsController';

const router = Router();

// Public — no auth needed
router.get('/news', getNews);

export default router;
