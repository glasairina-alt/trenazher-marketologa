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

export default router;
