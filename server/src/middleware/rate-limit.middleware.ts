import { rateLimit } from 'express-rate-limit';

// NOTE: express-rate-limit uses an in-memory store by default.
// In a Vercel serverless environment, each function instance has its own
// memory — limits are per-instance, not globally distributed. This meaningfully
// reduces abuse on any single warm instance. A Redis-backed store (e.g.
// @upstash/ratelimit) would be needed for full distributed protection.

/** 20 attempts per 15-minute window — covers login and register */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' }
});

/** 5 attempts per hour — covers forgot-password to limit email spam */
export const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in 1 hour.' }
});

/** 10 review submissions per hour — covers POST /opportunities/:id/advice */
export const adviceRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' }
});
