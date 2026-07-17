import { Router } from 'express';
import { getHistory, deleteHistoryItem, clearHistory } from '../controllers/historyController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Secure all history endpoints
router.use(requireAuth);

router.get('/', getHistory);
router.delete('/:id', deleteHistoryItem);
router.delete('/', clearHistory);

export default router;
