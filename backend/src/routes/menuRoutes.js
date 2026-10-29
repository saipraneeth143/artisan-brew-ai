import { Router } from 'express';
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import {
  verifySupabaseToken,
  verifyAdminRole,
} from '../middleware/authMiddleware.js';

const router = Router();

// Public Route: GET /api/menu
router.get('/', getAllMenuItems);

// Admin Protected Routes
router.post('/', verifySupabaseToken, verifyAdminRole, createMenuItem);
router.put('/:id', verifySupabaseToken, verifyAdminRole, updateMenuItem);
router.delete('/:id', verifySupabaseToken, verifyAdminRole, deleteMenuItem);

export default router;
