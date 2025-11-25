import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { securityLogger } from './utils/logger';

// Ensure JWT_SECRET is set - no fallback for security
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: string;
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    securityLogger.logUnauthorizedAccess(req.user?.id, req.user?.email, 'admin_endpoint', req.ip);
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// ============================================
// RATE LIMITING - Protection against DDoS and Spam
// ============================================

// Global API rate limiter (applies to all API endpoints)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    securityLogger.logRateLimitExceeded('api_global', req.ip);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  skipSuccessfulRequests: false,
  message: 'Слишком много попыток входа',
  handler: (req, res) => {
    securityLogger.logRateLimitExceeded('auth_login', req.ip);
    res.status(429).json({
      error: 'Слишком много попыток входа',
      message: 'Ваш аккаунт временно заблокирован. Попробуйте снова через 15 минут.',
    });
  }
});

// Strict rate limiter for registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 accounts per hour per IP (allows admin to create multiple users)
  skipSuccessfulRequests: false,
  message: 'Слишком много регистраций с этого IP-адреса',
  handler: (req, res) => {
    securityLogger.logRateLimitExceeded('auth_register', req.ip);
    res.status(429).json({
      error: 'Слишком много регистраций',
      message: 'Попробуйте снова через 1 час',
    });
  }
});

// Very strict limiter for payment webhook (prevents spam)
export const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 webhooks per minute per IP
  skipSuccessfulRequests: false,
  message: 'Too many webhook requests',
  handler: (req, res) => {
    securityLogger.logRateLimitExceeded('webhook', req.ip);
    res.status(429).json({
      error: 'Too many webhook requests',
      message: 'Potential spam detected',
    });
  }
});
