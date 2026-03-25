import { Hono } from 'hono';
import { getSupabaseClient, getSupabaseAdmin } from '../services/supabase';
import { successResponse, errorResponse } from '../utils/response';
import { validateRSVPInput, sanitizeInput } from '../middleware/validation';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const rsvp = new Hono<{ Bindings: Bindings }>();

// POST /rsvp
rsvp.post('/', validateRSVPInput, async (c) => {
  try {
    const body = await c.req.json();
    const { guest_id, status, message } = body;

    const sanitizedMessage = message ? sanitizeInput(message) : undefined;

    const supabase = getSupabaseAdmin(c.env);

    // Check if RSVP already exists
    const { data: existing } = await supabase
      .from('rsvp')
      .select('id')
      .eq('guest_id', guest_id)
      .single();

    let data, error;

    if (existing) {
      // Update existing RSVP
      const result = await supabase
        .from('rsvp')
        .update({ status, message: sanitizedMessage })
        .eq('guest_id', guest_id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new RSVP
      const result = await supabase
        .from('rsvp')
        .insert({ guest_id, status, message: sanitizedMessage })
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      return c.json(errorResponse('Failed to submit RSVP', 500), 500);
    }

    return c.json(successResponse(data, 'RSVP submitted successfully'), 201);
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// GET /rsvp/guest/:guest_id
rsvp.get('/guest/:guest_id', async (c) => {
  try {
    const guest_id = c.req.param('guest_id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('rsvp')
      .select('*')
      .eq('guest_id', guest_id)
      .single();

    if (error || !data) {
      return c.json(errorResponse('RSVP not found', 404), 404);
    }

    return c.json(successResponse(data));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// GET /rsvp/event/:event_id
rsvp.get('/event/:event_id', async (c) => {
  try {
    const event_id = c.req.param('event_id');
    const supabase = getSupabaseClient(c.env);

    const { data, error } = await supabase
      .from('rsvp')
      .select(`
        *,
        guests!inner(
          event_id,
          name
        )
      `)
      .eq('guests.event_id', event_id);

    if (error) {
      return c.json(errorResponse('Failed to fetch RSVPs', 500), 500);
    }

    return c.json(successResponse(data || []));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

export default rsvp;
