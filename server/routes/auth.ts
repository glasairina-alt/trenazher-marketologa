import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../db';
import { authenticateToken, authLimiter, registerLimiter, passwordChangeLimiter, AuthRequest } from '../middleware';
import { securityLogger } from '../utils/logger';

const router = express.Router();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string()
    .min(6, 'Пароль должен быть минимум 6 символов'),
  name: z.string().min(2, 'Имя должно быть минимум 2 символа').max(100),
  phone: z.string()
    .nullable()
    .optional()
    .refine((val) => {
      if (!val) return true; // Allow null/undefined/empty
      return /^\+7\s?\(?\d{3}\)?\s?\d{3}(-|\s)?\d{2}(-|\s)?\d{2}$/.test(val);
    }, {
      message: 'Телефон должен быть в российском формате (например, +7 (999) 123-45-67)'
    }),
});

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Текущий пароль обязателен'),
  newPassword: z.string().min(6, 'Новый пароль должен быть минимум 6 символов'),
});

// Register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Ошибка валидации данных',
        details: validation.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    const { email, password, name, phone } = validation.data;

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM trainer_marketing.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    // SECURITY: Explicitly set created_by_admin = false to prevent admin panel visibility
    const result = await query(
      `INSERT INTO trainer_marketing.users (email, password, name, phone, role, created_by_admin) 
       VALUES ($1, $2, $3, $4, $5, false) 
       RETURNING id, email, name, phone, role, created_at`,
      [email, hashedPassword, name, phone, 'user']
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' } // SECURITY: Reduced from 7d to 24h
    );

    // SECURITY: Log successful registration
    securityLogger.logRegistration(user.id, user.email, req.ip);

    res.status(201).json({
      token,
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Ошибка регистрации. Попробуйте позже.' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Ошибка валидации данных',
        details: validation.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    const { email, password } = validation.data;

    // Find user
    const result = await query(
      'SELECT * FROM trainer_marketing.users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      securityLogger.logAuthFailure(email, 'user_not_found', req.ip);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      securityLogger.logAuthFailure(email, 'invalid_password', req.ip);
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' } // SECURITY: Reduced from 7d to 24h
    );

    // SECURITY: Log successful login
    securityLogger.logAuthSuccess(user.id, user.email, req.ip);

    res.json({
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ошибка входа. Попробуйте позже.' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      'SELECT id, email, name, phone, role, created_at FROM trainer_marketing.users WHERE id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout (client-side token removal, this is just a placeholder)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Change password
router.patch('/password', authenticateToken, passwordChangeLimiter, async (req: AuthRequest, res) => {
  try {
    // Validate request body
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Ошибка валидации данных',
        details: validation.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }

    const { currentPassword, newPassword } = validation.data;
    const userId = req.user!.id;

    // Fetch user with current password hash
    const userResult = await query(
      'SELECT id, email, password, role FROM trainer_marketing.users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      securityLogger.logPasswordChangeFailed(userId, 'User not found', req.ip);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      securityLogger.logPasswordChangeFailed(userId, 'Incorrect current password', req.ip);
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password in database
    await query(
      'UPDATE trainer_marketing.users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    // Log successful password change
    securityLogger.logPasswordChangeSuccess(userId, user.email, req.ip);

    res.json({ 
      message: 'Пароль успешно изменен',
      success: true 
    });
  } catch (error) {
    console.error('Change password error:', error);
    if (req.user?.id) {
      securityLogger.logPasswordChangeFailed(req.user.id, error instanceof Error ? error.message : 'Unknown error', req.ip);
    }
    res.status(500).json({ error: 'Ошибка при смене пароля. Попробуйте позже.' });
  }
});

export default router;
