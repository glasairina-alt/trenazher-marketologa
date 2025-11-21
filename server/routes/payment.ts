import express from 'express';
import { query } from '../db';
import { authenticateToken, AuthRequest } from '../middleware';

const router = express.Router();

// Create payment (will integrate with YooKassa later)
// 💳 PAYMENT INTEGRATION REQUIRED
// This is a STUB - requires YooKassa shop_id and secret_key from user
// Price: 790 RUB for premium access
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    
    // TODO: Integrate with YooKassa API when shop credentials are provided
    // Steps needed:
    // 1. Get YooKassa shop_id and secret_key from user
    // 2. Call YooKassa API to create payment
    // 3. Return real payment URL to frontend
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
// ⚠️ CRITICAL SECURITY: This endpoint MUST verify YooKassa signature before production
// Without signature verification, anyone can call this and grant themselves premium access
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature from YooKassa
    // TODO: Replace with actual YooKassa signature verification
    const webhookSecret = process.env.YOOKASSA_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('❌ YOOKASSA_WEBHOOK_SECRET not set - webhook disabled for security');
      return res.status(503).json({ error: 'Webhook not configured' });
    }
    
    // Simple secret token verification (temporary until YooKassa integration)
    const providedSecret = req.headers['x-webhook-secret'];
    if (providedSecret !== webhookSecret) {
      console.warn('⚠️ Webhook called with invalid secret');
      return res.status(403).json({ error: 'Invalid webhook secret' });
    }
    
    // TODO: Replace with proper YooKassa signature verification:
    // const signature = req.headers['x-yookassa-signature'];
    // const hmac = crypto.createHmac('sha256', YOOKASSA_SECRET);
    // hmac.update(JSON.stringify(req.body));
    // const expectedSignature = hmac.digest('hex');
    // if (signature !== expectedSignature) {
    //   return res.status(403).json({ error: 'Invalid signature' });
    // }
    
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
