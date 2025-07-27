import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUserById
} from '../controllers/authController';
import { authenticate, requireAdmin, requireAuth } from '../middleware/auth';
import {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  validateUserUpdate
} from '../middleware/validation';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', ...validateRegistration, register);
router.post('/login', ...validateLogin, login);

// Protected routes (authentication required)
router.get('/profile', authenticate, requireAuth, getProfile);
router.put('/profile', authenticate, requireAuth, ...validateUserUpdate, updateProfile);
router.put('/change-password', authenticate, requireAuth, ...validatePasswordChange, changePassword);

// Admin only routes
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.delete('/users/:id', authenticate, requireAdmin, deleteUserById);

export default router;