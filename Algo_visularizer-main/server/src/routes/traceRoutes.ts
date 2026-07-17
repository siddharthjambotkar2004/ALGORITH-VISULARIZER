import { Router } from 'express';
import { getAlgorithmTrace } from '../controllers/traceController.js';
import { optionalAuth } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Strict rate limit: 10 req/min per IP (or authenticated user)
const traceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Trace generation limit reached. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/trace', optionalAuth, traceLimiter, getAlgorithmTrace);

export default router;
