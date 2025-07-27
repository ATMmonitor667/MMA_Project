import { Request, Response } from 'express';
import {
  User,
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  deleteUser,
  findAllUsers,
  hashPassword,
  verifyPassword
} from '../models/User';
import { generateToken } from '../utils/jwt';

export class AuthController {
  // Register a new user
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, role = 'user' } = req.body;

      // Check if user already exists
      const existingUserByEmail = await findUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const existingUserByUsername = await findUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Hash password before creating user
      const password_hash = await hashPassword(password);

      // Create new user
      const newUser = await createUser({
        username,
        email,
        password_hash,
        role
      });

      // Generate JWT token
      const token = generateToken(newUser);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Create user object without password
      const userWithoutPassword = {
        user_id: user.user_id!,
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        created_at: user.created_at!,
        updated_at: user.updated_at!
      };

      // Generate JWT token
      const token = generateToken(userWithoutPassword);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { username, email } = req.body;
      const updates: Partial<User> = {};

      if (username) updates.username = username;
      if (email) updates.email = email;

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await findUserByEmail(email);
        if (existingUser && existingUser.user_id !== userId) {
          return res.status(400).json({
            success: false,
            message: 'Email already taken'
          });
        }
      }

      // Check if username is already taken by another user
      if (username) {
        const existingUser = await findUserByUsername(username);
        if (existingUser && existingUser.user_id !== userId) {
          return res.status(400).json({
            success: false,
            message: 'Username already taken'
          });
        }
      }

      const updatedUser = await updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get current user with password
      const user = await findUserByEmail(req.user?.email || '');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password and update
      const hashedNewPassword = await hashPassword(newPassword);
      const updatedUser = await updateUser(userId, { password_hash: hashedNewPassword });
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await findAllUsers();

      res.json({
        success: true,
        data: { users }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete user (admin only)
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }

      // Prevent admin from deleting themselves
      if (userId === req.user?.userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      const deleted = await deleteUser(userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
