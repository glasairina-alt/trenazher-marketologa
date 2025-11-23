import express from 'express';
import crypto from 'crypto';
import { query } from '../db';
import { authenticateToken, webhookLimiter, AuthRequest } from '../middleware';
import { securityLogger } from '../utils/logger';

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
// ✅ SECURED: HMAC signature verification + rate limiting
router.post('/webhook', webhookLimiter, async (req, res) => {
  try {
    const webhookSecret = process.env.YOOKASSA_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('❌ YOOKASSA_WEBHOOK_SECRET not set - webhook disabled for security');
      return res.status(503).json({ error: 'Webhook not configured' });
    }
    
    // SECURITY: req.body is a Buffer (raw body) thanks to express.raw middleware
    // This is CRITICAL for HMAC verification - we must verify the exact bytes YooKassa signed
    const rawBody = req.body as Buffer;
    
    if (!rawBody || rawBody.length === 0) {
      return res.status(400).json({ error: 'Empty request body' });
    }
    
    // SECURITY: Verify HMAC signature from YooKassa
    const signature = req.headers['x-yookassa-signature'] as string;
    
    if (!signature) {
      securityLogger.logWebhookSignatureInvalid(req.ip, undefined);
      return res.status(403).json({ error: 'Missing signature' });
    }
    
    // SECURITY: Normalize and validate signature (must be hex string)
    const normalizedSignature = signature.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(normalizedSignature)) {
      securityLogger.logWebhookSignatureInvalid(req.ip, normalizedSignature);
      return res.status(403).json({ error: 'Invalid signature format' });
    }
    
    // SECURITY: Calculate HMAC over RAW BODY (not parsed JSON)
    // This is the only way to correctly verify YooKassa signatures
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest('hex');
    
    // SECURITY: Constant-time comparison to prevent timing attacks
    // Both signatures are now normalized to same length/format
    let signaturesMatch = false;
    try {
      signaturesMatch = crypto.timingSafeEqual(
        Buffer.from(normalizedSignature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      // Length mismatch or encoding error - signature is invalid
      securityLogger.logWebhookSignatureInvalid(req.ip, normalizedSignature);
      return res.status(403).json({ error: 'Invalid signature' });
    }
    
    if (!signaturesMatch) {
      securityLogger.logWebhookSignatureInvalid(req.ip, normalizedSignature);
      return res.status(403).json({ error: 'Invalid signature' });
    }
    
    // SECURITY: Signature verified! Now parse JSON for processing
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody.toString('utf8'));
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    
    const { event, object } = parsedBody;
    
    // SECURITY: Log verified webhook for monitoring
    securityLogger.logWebhookVerified(object?.id, 0, object?.amount?.value, req.ip);
    
    // When payment is successful
    if (event === 'payment.succeeded' && object?.status === 'succeeded') {
      const userId = object.metadata?.userId;
      const paymentId = object.id;
      const amount = object.amount?.value;
      
      if (!userId) {
        console.error('❌ Payment succeeded but no userId in metadata');
        return res.status(400).json({ error: 'Missing userId in metadata' });
      }
      
      // Verify amount (790 RUB for premium)
      if (parseFloat(amount) !== 790) {
        console.error(`❌ Payment amount mismatch: expected 790, got ${amount}`);
        return res.status(400).json({ error: 'Invalid payment amount' });
      }
      
      // Check if payment was already processed (idempotency)
      const existingPayment = await query(
        `SELECT id FROM trainer_marketing.users WHERE id = $1 AND role = 'premium_user'`,
        [userId]
      );
      
      if (existingPayment.rows.length > 0) {
        console.log(`⚠️ User ${userId} already premium - duplicate webhook ignored`);
        return res.status(200).json({ received: true, message: 'Already processed' });
      }
      
      // Upgrade user to premium
      const result = await query(
        `UPDATE trainer_marketing.users 
         SET role = 'premium_user' 
         WHERE id = $1
         RETURNING id, email, role`,
        [userId]
      );
      
      if (result.rows.length === 0) {
        console.error(`❌ User ${userId} not found in database`);
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = result.rows[0];
      
      // SECURITY: Log successful premium upgrade for audit trail
      securityLogger.logPaymentUpgrade(user.id, user.email, paymentId);
      
      console.log(`✅ User ${userId} (${user.email}) upgraded to premium after payment ${paymentId}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
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
