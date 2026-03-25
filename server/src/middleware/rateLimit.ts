import { Context, Next } from 'hono';
import { errorResponse } from '../utils/response';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimit = (options: {
  windowMs: number;
  maxRequests: number;
}) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + options.windowMs,
      };
      await next();
      return;
    }

    store[key].count++;

    if (store[key].count > options.maxRequests) {
      c.header('X-RateLimit-Limit', options.maxRequests.toString());
      c.header('X-RateLimit-Remaining', '0');
      c.header('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());
      
      return c.json(
        errorResponse('Too many requests, please try again later', 429),
        429
      );
    }

    c.header('X-RateLimit-Limit', options.maxRequests.toString());
    c.header('X-RateLimit-Remaining', (options.maxRequests - store[key].count).toString());
    c.header('X-RateLimit-Reset', new Date(store[key].resetTime).toISOString());

    await next();
  };
};

setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 60000);
