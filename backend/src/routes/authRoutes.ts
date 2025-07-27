import express from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate, requireAdmin, requireAuth } from '../middleware/auth';
import { 
  validateRegistration, 
  validateLogin, 
  validatePasswordChange, 
  validateUserUpdate 
} from '../middleware/validation';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Protected routes (authentication required)
router.get('/profile', authenticate, requireAuth, AuthController.getProfile);
router.put('/profile', authenticate, requireAuth, validateUserUpdate, AuthController.updateProfile);
router.put('/change-password', authenticate, requireAuth, validatePasswordChange, AuthController.changePassword);

// Admin only routes
router.get('/users', authenticate, requireAdmin, AuthController.getAllUsers);
router.delete('/users/:id', authenticate, requireAdmin, AuthController.deleteUser);

export default router;