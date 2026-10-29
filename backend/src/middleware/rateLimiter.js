import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter:
 * Max 100 requests per 15 minutes per IP address
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * AI Endpoint Rate Limiter:
 * Max 10 requests per minute per IP address
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'Master Barista Antoine is crafting recommendations. Rate limit reached (max 10 AI requests per minute). Please wait a moment.',
  },
});
