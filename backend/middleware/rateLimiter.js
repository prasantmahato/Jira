// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: options.message || {
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
};

export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
});

export const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10
});
