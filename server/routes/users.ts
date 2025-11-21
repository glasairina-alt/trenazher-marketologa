import express from 'express';
import { query } from '../db';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const result = await query(
      `SELECT id, email, name, phone, role, created_at 
       FROM trainer_marketing.users 
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Update user role (admin only)
router.patch('/:userId/role', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'premium_user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

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
router.post('/:userId/upgrade-to-premium', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Allow user to upgrade themselves or admin to upgrade anyone
    if (req.user!.id !== parseInt(userId) && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot upgrade other users' });
    }

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

export default router;
