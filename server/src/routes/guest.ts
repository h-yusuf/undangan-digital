import { Hono } from 'hono';
import { getSupabaseClient, getSupabaseAdmin } from '../services/supabase';
import { successResponse, errorResponse } from '../utils/response';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const guest = new Hono<{ Bindings: Bindings }>();

// GET /guest/:id
guest.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return c.json(errorResponse('Guest not found', 404), 404);
    }

    return c.json(successResponse(data));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// POST /guest
guest.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { event_id, name, phone, email } = body;

    if (!event_id || !name) {
      return c.json(errorResponse('event_id and name are required', 400), 400);
    }

    const supabase = getSupabaseAdmin(c.env);

    const { data, error } = await supabase
      .from('guests')
      .insert({ event_id, name, phone, email })
      .select()
      .single();

    if (error) {
      return c.json(errorResponse('Failed to create guest', 500), 500);
    }

    return c.json(successResponse(data, 'Guest created successfully'), 201);
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// GET /guest/event/:event_id
guest.get('/event/:event_id', async (c) => {
  try {
    const event_id = c.req.param('event_id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', event_id);

    if (error) {
      return c.json(errorResponse('Failed to fetch guests', 500), 500);
    }

    return c.json(successResponse(data || []));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// GET /guest/find?event_id=xxx&name=xxx
guest.get('/find', async (c) => {
  try {
    const event_id = c.req.query('event_id');
    const name = c.req.query('name');

    if (!event_id || !name) {
      return c.json(errorResponse('event_id and name are required', 400), 400);
    }

    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', event_id)
      .ilike('name', name)
      .single();

    if (error || !data) {
      return c.json(errorResponse('Guest not found', 404), 404);
    }

    return c.json(successResponse(data));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

export default guest;
