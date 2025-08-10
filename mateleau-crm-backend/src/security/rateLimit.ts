import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 tentatives / 15min
  message: { message: 'Too many login attempts, try later.' }
});

export const loginSlowdown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,          // après 5 tentatives
  delayMs: 500,           // +500ms / requête
  validate: { delayMs: false }
});
