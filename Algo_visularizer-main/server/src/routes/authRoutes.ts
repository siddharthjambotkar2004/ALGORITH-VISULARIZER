import { Router } from 'express';
import { signup, signin, signout, me } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/me', requireAuth, me);

export default router;
