import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db';
import { apiLimiter } from './middleware';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import paymentRoutes from './routes/payment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || (isProduction ? '5000' : '3001'), 10);

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// SECURITY: Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // SECURITY: Only allow unsafe-inline in development for Vite HMR
      scriptSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      styleSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny' // Prevent clickjacking
  },
  noSniff: true, // Prevent MIME type sniffing
  xssFilter: true, // Enable XSS filter
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// SECURITY: CORS configuration (restrict origins in production)
const corsOptions = {
  origin: isProduction 
    ? process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5000'
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// SECURITY: Trust proxy for rate limiting (required for X-Forwarded-For header)
// Enable this when behind a reverse proxy (like Replit's infrastructure)
app.set('trust proxy', 1);

// SECURITY: Capture raw body for webhook HMAC verification BEFORE parsing JSON
// YooKassa signs the raw body, so we must verify against the exact bytes
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Parse JSON for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SECURITY: Apply rate limiting to ALL API endpoints (DDoS protection)
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Production: serve static files from dist folder
if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  
  app.use(express.static(distPath));
  
  // SPA fallback: serve index.html for all non-API routes
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Skip static files (they were already handled by express.static)
    if (req.path.match(/\.\w+$/)) {
      return next();
    }
    
    // Serve index.html for all other routes (SPA routing)
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
  console.log(`🌍 Environment: ${isProduction ? 'production' : 'development'}`);
});

export default app;
