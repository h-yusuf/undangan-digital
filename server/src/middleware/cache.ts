import { Context, Next } from 'hono';

export const cacheMiddleware = (maxAge: number = 300) => {
  return async (c: Context, next: Next) => {
    await next();
    
    if (c.req.method === 'GET' && c.res.ok) {
      c.res.headers.set('Cache-Control', `public, max-age=${maxAge}`);
    }
  };
};

export const noCacheMiddleware = async (c: Context, next: Next) => {
  await next();
  c.res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
};
