import { Router } from 'express';
import { getFighterCard } from '../controllers/getFighterCard';
import { getEnrichedFighter, searchFighters } from '../services/fighterEnrichmentService';

const router = Router();

// Legacy: look up fighter card by name
router.post('/fighters', getFighterCard);

// Get enriched fighter profile by DB id (real record, image, physical stats)
router.get('/fighters/:id', async (req, res) => {
  try {
    const fighter = await getEnrichedFighter(Number(req.params.id));
    if (!fighter) { res.status(404).json({ success: false, message: 'Fighter not found' }); return; }
    res.json({ success: true, data: { fighter } });
  } catch (err) {
    console.error('getEnrichedFighter error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Autocomplete search
router.get('/fighters/search/:query', async (req, res) => {
  try {
    const results = await searchFighters(req.params.query);
    res.json({ success: true, data: { fighters: results } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
