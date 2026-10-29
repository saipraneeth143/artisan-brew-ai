import { Router } from 'express';
import { recommend, analyzeCart } from '../controllers/aiController.js';
import { optionalSupabaseToken } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply strict AI rate limiter (max 10 req/min)
router.use(aiLimiter);

// POST /api/ai/recommend
router.post('/recommend', optionalSupabaseToken, recommend);

// POST /api/ai/analyze-cart
router.post('/analyze-cart', optionalSupabaseToken, analyzeCart);

export default router;
