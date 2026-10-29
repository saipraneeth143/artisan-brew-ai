import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
} from '../controllers/orderController.js';
import {
  verifySupabaseToken,
  verifyAdminRole,
} from '../middleware/authMiddleware.js';

const router = Router();

// Customer Authenticated Routes
router.post('/', verifySupabaseToken, createOrder);
router.get('/my-orders', verifySupabaseToken, getMyOrders);

// Admin Protected Routes
router.get('/admin/all', verifySupabaseToken, verifyAdminRole, getAllOrdersAdmin);
router.patch('/:id/status', verifySupabaseToken, verifyAdminRole, updateOrderStatus);

export default router;
