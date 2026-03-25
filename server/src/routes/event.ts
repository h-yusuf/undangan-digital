import { Hono } from 'hono';
import { getSupabaseClient } from '../services/supabase';
import { successResponse, errorResponse } from '../utils/response';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const event = new Hono<{ Bindings: Bindings }>();

// GET /event/:slug
event.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return c.json(errorResponse('Event not found', 404), 404);
    }

    return c.json(successResponse(data));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

export default event;
