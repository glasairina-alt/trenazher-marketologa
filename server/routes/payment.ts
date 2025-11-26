import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import { authenticateToken, webhookLimiter, AuthRequest } from '../middleware';
import { securityLogger } from '../utils/logger';

const YooKassa = require('yookassa');

const router = express.Router();

// Initialize YooKassa client
const shopId = process.env.YOOKASSA_SHOP_ID;
const secretKey = process.env.YOOKASSA_SECRET_KEY;

let yooKassa: any = null;

if (shopId && secretKey) {
  yooKassa = new YooKassa({
    shopId: shopId,
    secretKey: secretKey
  });
  console.log('✅ YooKassa initialized with shop ID:', shopId);
} else {
  console.warn('⚠️ YooKassa credentials not set - payment creation will fail');
}

// Price for premium access
const PREMIUM_PRICE = '790.00';
const CURRENCY = 'RUB';

// Create payment with YooKassa
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const userEmail = req.user!.email;
    
    if (!yooKassa) {
      console.error('❌ YooKassa not initialized');
      return res.status(503).json({ error: 'Payment system not configured' });
    }
    
    // Check if user is already premium
    const existingPremium = await query(
      `SELECT role FROM trainer_marketing.users WHERE id = $1`,
      [userId]
    );
    
    if (existingPremium.rows.length > 0 && existingPremium.rows[0].role === 'premium_user') {
      return res.status(400).json({ error: 'У вас уже есть премиум-доступ' });
    }
    
    // Get host for return URL
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    // Create payment via YooKassa API
    const idempotenceKey = uuidv4();
    
    const payment = await yooKassa.createPayment({
      amount: {
        value: PREMIUM_PRICE,
        currency: CURRENCY
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${baseUrl}/payment/success`
      },
      description: 'Полный доступ к тренажеру маркетолога "Твой первый клиент"',
      metadata: {
        userId: String(userId),
        userEmail: userEmail
      },
      receipt: {
        customer: {
          email: userEmail
        },
        items: [
          {
            description: 'Полный доступ к тренажеру маркетолога',
            quantity: '1',
            amount: {
              value: PREMIUM_PRICE,
              currency: CURRENCY
            },
            vat_code: 1,
            payment_subject: 'service',
            payment_mode: 'full_payment'
          }
        ]
      }
    }, idempotenceKey);
    
    console.log(`💳 Payment created: ${payment.id} for user ${userId} (${userEmail})`);
    
    // Return payment data to frontend
    res.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation.confirmation_url,
      status: payment.status,
      amount: payment.amount.value,
      currency: payment.amount.currency
    });
    
  } catch (error: any) {
    console.error('❌ Create payment error:', error);
    
    // Handle YooKassa specific errors
    if (error.code) {
      return res.status(400).json({ 
        error: 'Ошибка платежной системы', 
        details: error.message 
      });
    }
    
    res.status(500).json({ error: 'Не удалось создать платёж' });
  }
});

// Check payment status
router.get('/status/:paymentId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user!.id;
    
    if (!yooKassa) {
      return res.status(503).json({ error: 'Payment system not configured' });
    }
    
    const payment = await yooKassa.getPayment(paymentId);
    
    // Verify this payment belongs to the requesting user
    if (payment.metadata?.userId !== String(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // If payment succeeded, upgrade user to premium
    if (payment.status === 'succeeded' && payment.paid === true) {
      const result = await query(
        `UPDATE trainer_marketing.users 
         SET role = 'premium_user' 
         WHERE id = $1 AND role != 'premium_user'
         RETURNING id, email, role`,
        [userId]
      );
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        securityLogger.logPaymentUpgrade(user.id, user.email, paymentId);
        console.log(`✅ User ${userId} upgraded to premium via status check`);
      }
    }
    
    res.json({
      paymentId: payment.id,
      status: payment.status,
      paid: payment.paid,
      amount: payment.amount.value,
      currency: payment.amount.currency
    });
    
  } catch (error: any) {
    console.error('❌ Get payment status error:', error);
    res.status(500).json({ error: 'Не удалось получить статус платежа' });
  }
});

// YooKassa webhook for payment notifications
// Note: YooKassa sends notifications from specific IP ranges
const YOOKASSA_IP_RANGES = [
  '185.71.76.',
  '185.71.77.',
  '77.75.153.',
  '77.75.154.',
  '77.75.156.'
];

function isYooKassaIP(ip: string | undefined): boolean {
  if (!ip) return false;
  
  // Handle x-forwarded-for
  const clientIP = ip.split(',')[0].trim();
  
  // Remove IPv6 prefix if present
  const cleanIP = clientIP.replace('::ffff:', '');
  
  // In development, allow localhost
  if (process.env.NODE_ENV !== 'production' && (cleanIP === '127.0.0.1' || cleanIP === 'localhost')) {
    return true;
  }
  
  return YOOKASSA_IP_RANGES.some(range => cleanIP.startsWith(range));
}

router.post('/webhook', webhookLimiter, express.json(), async (req, res) => {
  try {
    // Log incoming webhook for debugging
    console.log('📥 Webhook received from IP:', req.ip);
    
    // Verify IP in production
    if (process.env.NODE_ENV === 'production' && !isYooKassaIP(req.ip)) {
      console.warn('⚠️ Webhook from unauthorized IP:', req.ip);
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { event, object } = req.body;
    
    console.log(`📥 Webhook event: ${event}, payment: ${object?.id}, status: ${object?.status}`);
    
    // Handle successful payment
    if (event === 'payment.succeeded' && object?.status === 'succeeded') {
      const userId = object.metadata?.userId;
      const paymentId = object.id;
      const amount = object.amount?.value;
      
      if (!userId) {
        console.error('❌ Payment succeeded but no userId in metadata');
        return res.status(200).json({ received: true, message: 'No userId' });
      }
      
      // Verify amount
      if (amount !== PREMIUM_PRICE) {
        console.error(`❌ Payment amount mismatch: expected ${PREMIUM_PRICE}, got ${amount}`);
        return res.status(200).json({ received: true, message: 'Amount mismatch' });
      }
      
      // Check if already processed (idempotency)
      const existingPremium = await query(
        `SELECT id FROM trainer_marketing.users WHERE id = $1 AND role = 'premium_user'`,
        [userId]
      );
      
      if (existingPremium.rows.length > 0) {
        console.log(`⚠️ User ${userId} already premium - webhook duplicate`);
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
        console.error(`❌ User ${userId} not found`);
        return res.status(200).json({ received: true, message: 'User not found' });
      }
      
      const user = result.rows[0];
      securityLogger.logPaymentUpgrade(user.id, user.email, paymentId);
      console.log(`✅ User ${userId} (${user.email}) upgraded to premium via webhook`);
    }
    
    // Handle cancelled payment
    if (event === 'payment.canceled') {
      console.log(`❌ Payment ${object?.id} was cancelled`);
    }
    
    // Always respond 200 to acknowledge receipt
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    // Still respond 200 to prevent retries for processing errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});

// Success page after payment
router.get('/success', (req, res) => {
  res.redirect('/payment/success');
});

export default router;
