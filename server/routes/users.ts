import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware';
import { z } from 'zod';

const router = express.Router();

const SALT_ROUNDS = 10;

// Validation schema for admin user creation
const adminCreateUserSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().nullable().optional(),
  role: z.enum(['user', 'premium_user']).default('premium_user'),
});

// Get all users created by admin (admin only)
// SECURITY: Only shows users created via admin panel, NOT users who registered themselves
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, phone, role, created_at 
       FROM trainer_marketing.users 
       WHERE created_by_admin = true
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Create new user via admin panel (admin only)
// SECURITY: Sets created_by_admin = true to mark admin-created users
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Validate request body
    const validation = adminCreateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Ошибка валидации данных',
        details: validation.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    const { email, password, name, phone, role } = validation.data;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM trainer_marketing.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user with created_by_admin = true
    const result = await query(
      `INSERT INTO trainer_marketing.users (email, password, name, phone, role, created_by_admin) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING id, email, name, phone, role, created_at`,
      [email, hashedPassword, name, phone || null, role]
    );

    const user = result.rows[0];

    // Log admin action for audit trail
    console.log(`✅ Admin ${req.user!.email} created user ${user.email} with role ${role}`);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Не удалось создать пользователя' });
  }
});

// Update user role (admin only)
// ⚠️ IMPORTANT: Premium users should ONLY be created via YooKassa payment webhook
// This endpoint is for admin management ONLY (e.g., granting free access, fixing issues)
router.patch('/:userId/role', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'premium_user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Log admin actions for audit trail
    console.log(`⚠️ Admin ${req.user!.email} changing user ${userId} role to ${role}`);

    const result = await query(
      `UPDATE trainer_marketing.users 
       SET role = $1 
       WHERE id = $2 
       RETURNING id, email, name, phone, role`,
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Upgrade user to premium (used by payment webhook)
// ⚠️ SECURITY: This endpoint is ONLY for admins during development
// In production, premium upgrades happen ONLY via YooKassa webhook
router.post('/:userId/upgrade-to-premium', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    
    // Log admin action for audit
    console.log(`⚠️ Admin ${req.user!.email} manually upgrading user ${userId} to premium`);

    const result = await query(
      `UPDATE trainer_marketing.users 
       SET role = 'premium_user' 
       WHERE id = $1 
       RETURNING id, email, name, phone, role`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Upgrade to premium error:', error);
    res.status(500).json({ error: 'Failed to upgrade to premium' });
  }
});

// Delete user (admin only)
// SECURITY: Only deletes admin-created users (created_by_admin = true)
router.delete('/:userId', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Get user info before deletion for logging
    const userInfo = await query(
      'SELECT email, created_by_admin FROM trainer_marketing.users WHERE id = $1',
      [userId]
    );

    if (userInfo.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // SECURITY: Prevent deletion of self-registered users
    if (!userInfo.rows[0].created_by_admin) {
      return res.status(403).json({ 
        error: 'Нельзя удалить пользователя, зарегистрировавшегося самостоятельно' 
      });
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user!.id) {
      return res.status(403).json({ error: 'Нельзя удалить собственный аккаунт' });
    }

    // Delete user
    await query(
      'DELETE FROM trainer_marketing.users WHERE id = $1',
      [userId]
    );

    // Log admin action for audit trail
    console.log(`🗑️ Admin ${req.user!.email} deleted user ${userInfo.rows[0].email}`);

    res.json({ success: true, message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Не удалось удалить пользователя' });
  }
});

export default router;
