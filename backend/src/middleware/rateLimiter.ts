import rateLimit from 'express-rate-limit';
import Database from '../config/database';
import logger from '../config/logger';

const db = Database.getInstance();

// Redis store for rate limiting
const redisStore = {
  incr: async (key: string) => {
    try {
      if (!db.redisClient) return { totalHits: 1, resetTime: new Date() };
      
      const current = await db.redisClient.incr(key);
      if (current === 1) {
        await db.redisClient.expire(key, 900); // 15 minutes
      }
      const ttl = await db.redisClient.ttl(key);
      return {
        totalHits: current,
        resetTime: new Date(Date.now() + ttl * 1000)
      };
    } catch (error) {
      logger.error('Redis rate limit error:', error);
      return { totalHits: 1, resetTime: new Date() };
    }
  },
  
  decrement: async (key: string) => {
    try {
      if (!db.redisClient) return;
      await db.redisClient.decr(key);
    } catch (error) {
      logger.error('Redis decrement error:', error);
    }
  },
  
  resetKey: async (key: string) => {
    try {
      if (!db.redisClient) return;
      await db.redisClient.del(key);
    } catch (error) {
      logger.error('Redis reset key error:', error);
    }
  }
};

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: db.redisClient ? {
    incr: redisStore.incr,
    decrement: redisStore.decrement,
    resetKey: redisStore.resetKey,
  } : undefined,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Contact form rate limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  message: {
    success: false,
    message: 'Too many contact form submissions, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});