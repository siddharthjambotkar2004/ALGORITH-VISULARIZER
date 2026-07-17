import { Router } from 'express';
import { 
  getAllAlgorithms, 
  getAlgorithmById, 
  createAlgorithm, 
  updateAlgorithm, 
  deleteAlgorithm,
  getAllUsers,
  deleteUser
} from '../controllers/adminController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAdmin);

router.get('/algorithms', getAllAlgorithms);
router.get('/algorithms/:id', getAlgorithmById);
router.post('/algorithms', createAlgorithm);
router.put('/algorithms/:id', updateAlgorithm);
router.delete('/algorithms/:id', deleteAlgorithm);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

export default router;
