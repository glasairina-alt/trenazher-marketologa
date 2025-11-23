/**
 * Security Event Logger
 * Provides structured logging for security-relevant events
 * Format: JSON for easy parsing and alerting
 */

export enum SecurityEventType {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  WEBHOOK_SIGNATURE_INVALID = 'WEBHOOK_SIGNATURE_INVALID',
  WEBHOOK_VERIFIED = 'WEBHOOK_VERIFIED',
  PAYMENT_UPGRADE = 'PAYMENT_UPGRADE',
  ADMIN_ACTION = 'ADMIN_ACTION',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  REGISTRATION = 'REGISTRATION',
}

interface SecurityEvent {
  timestamp: string;
  type: SecurityEventType;
  severity: 'info' | 'warning' | 'critical';
  ip?: string;
  userId?: number;
  email?: string;
  details: Record<string, any>;
}

class SecurityLogger {
  private log(event: SecurityEvent) {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    // In production, this would go to a logging service (e.g., CloudWatch, Datadog)
    // For now, we log to console in structured JSON format
    const severityPrefix = {
      info: '✅',
      warning: '⚠️',
      critical: '🚨',
    };

    console.log(`${severityPrefix[event.severity]} [SECURITY] ${JSON.stringify(logEntry)}`);
  }

  logAuthSuccess(userId: number, email: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.AUTH_SUCCESS,
      severity: 'info',
      userId,
      email,
      ip,
      details: { action: 'login' }
    });
  }

  logAuthFailure(email: string, reason: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.AUTH_FAILURE,
      severity: 'warning',
      email,
      ip,
      details: { reason }
    });
  }

  logRateLimitExceeded(endpoint: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      severity: 'warning',
      ip,
      details: { endpoint }
    });
  }

  logWebhookSignatureInvalid(ip?: string, receivedSignature?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.WEBHOOK_SIGNATURE_INVALID,
      severity: 'critical',
      ip,
      details: { 
        message: 'Potential fraud attempt - invalid webhook signature',
        receivedSignature: receivedSignature?.substring(0, 10) + '...' // Only log first 10 chars
      }
    });
  }

  logWebhookVerified(paymentId: string, userId: number, amount: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.WEBHOOK_VERIFIED,
      severity: 'info',
      userId,
      ip,
      details: { paymentId, amount }
    });
  }

  logPaymentUpgrade(userId: number, email: string, paymentId: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.PAYMENT_UPGRADE,
      severity: 'info',
      userId,
      email,
      details: { paymentId, role: 'premium_user' }
    });
  }

  logAdminAction(adminId: number, adminEmail: string, action: string, targetUserId?: number, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.ADMIN_ACTION,
      severity: 'info',
      userId: adminId,
      email: adminEmail,
      ip,
      details: { action, targetUserId }
    });
  }

  logUnauthorizedAccess(userId?: number, email?: string, resource?: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.UNAUTHORIZED_ACCESS,
      severity: 'warning',
      userId,
      email,
      ip,
      details: { resource }
    });
  }

  logRegistration(userId: number, email: string, ip?: string) {
    this.log({
      timestamp: new Date().toISOString(),
      type: SecurityEventType.REGISTRATION,
      severity: 'info',
      userId,
      email,
      ip,
      details: { action: 'user_registration' }
    });
  }
}

export const securityLogger = new SecurityLogger();
