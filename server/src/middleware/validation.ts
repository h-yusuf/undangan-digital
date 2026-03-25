import { Context, Next } from 'hono';
import { errorResponse } from '../utils/response';

export const validateGuestInput = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const { event_id, name } = body;

  if (!event_id || typeof event_id !== 'string') {
    return c.json(errorResponse('event_id is required and must be a string', 400), 400);
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return c.json(errorResponse('name is required and must be a non-empty string', 400), 400);
  }

  if (name.length > 100) {
    return c.json(errorResponse('name must be less than 100 characters', 400), 400);
  }

  if (body.phone && typeof body.phone !== 'string') {
    return c.json(errorResponse('phone must be a string', 400), 400);
  }

  if (body.email && typeof body.email !== 'string') {
    return c.json(errorResponse('email must be a string', 400), 400);
  }

  if (body.email && !isValidEmail(body.email)) {
    return c.json(errorResponse('email format is invalid', 400), 400);
  }

  await next();
};

export const validateRSVPInput = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const { guest_id, status } = body;

  if (!guest_id || typeof guest_id !== 'string') {
    return c.json(errorResponse('guest_id is required and must be a string', 400), 400);
  }

  if (!status || typeof status !== 'string') {
    return c.json(errorResponse('status is required and must be a string', 400), 400);
  }

  const validStatuses = ['hadir', 'tidak_hadir', 'ragu'];
  if (!validStatuses.includes(status)) {
    return c.json(errorResponse('status must be one of: hadir, tidak_hadir, ragu', 400), 400);
  }

  if (body.message && typeof body.message !== 'string') {
    return c.json(errorResponse('message must be a string', 400), 400);
  }

  if (body.message && body.message.length > 500) {
    return c.json(errorResponse('message must be less than 500 characters', 400), 400);
  }

  await next();
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
};
