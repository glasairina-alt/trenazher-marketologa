import express from 'express';
import { query } from '../db';
import { authenticateToken, AuthRequest } from '../middleware';

const router = express.Router();

// Create payment (will integrate with YooKassa later)
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // TODO: Integrate with YooKassa API
    // For now, return a mock payment URL
    
    const paymentData = {
      paymentId: `test_${Date.now()}`,
      amount: 790,
      currency: 'RUB',
      description: 'Полный доступ к тренажеру маркетолога',
      confirmationUrl: `${req.protocol}://${req.get('host')}/payment/confirm`,
      userId: userId,
    };
    
    res.json(paymentData);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Payment webhook from YooKassa
router.post('/webhook', async (req, res) => {
  try {
    // TODO: Verify webhook signature from YooKassa
    
    const { event, object } = req.body;
    
    // When payment is successful
    if (event === 'payment.succeeded' && object?.status === 'succeeded') {
      const userId = object.metadata?.userId;
      
      if (userId) {
        // Upgrade user to premium
        await query(
          `UPDATE trainer_marketing.users 
           SET role = 'premium_user' 
           WHERE id = $1`,
          [userId]
        );
        
        console.log(`✅ User ${userId} upgraded to premium after payment`);
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Mock payment confirmation page
router.get('/confirm', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Оплата успешна</title>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .success { color: #22c55e; font-size: 24px; margin-bottom: 20px; }
        .message { font-size: 18px; margin-bottom: 30px; }
        button { 
          background: #4680C2; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          font-size: 16px; 
          border-radius: 6px; 
          cursor: pointer; 
        }
        button:hover { background: #3a6ba5; }
      </style>
    </head>
    <body>
      <div class="success">✅ Оплата прошла успешно!</div>
      <div class="message">Теперь у вас есть полный доступ к тренажеру</div>
      <button onclick="window.location.href='/'">Перейти к тренажеру</button>
      <script>
        // Auto redirect after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      </script>
    </body>
    </html>
  `);
});

export default router;
