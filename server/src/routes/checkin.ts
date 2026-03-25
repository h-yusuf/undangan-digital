import { Hono } from 'hono';
import { getSupabaseAdmin } from '../services/supabase';
import { successResponse, errorResponse } from '../utils/response';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const checkin = new Hono<{ Bindings: Bindings }>();

// POST /checkin
checkin.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { guest_id, event_id } = body;

    if (!guest_id || !event_id) {
      return c.json(errorResponse('guest_id and event_id are required', 400), 400);
    }

    const supabase = getSupabaseAdmin(c.env);

    // Verify guest exists and belongs to event
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, event_id, name')
      .eq('id', guest_id)
      .eq('event_id', event_id)
      .single();

    if (guestError || !guest) {
      return c.json(errorResponse('Guest not found or invalid event', 404), 404);
    }

    // Record check-in
    const { data, error } = await supabase
      .from('checkins')
      .insert({
        guest_id,
        checked_in_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return c.json(errorResponse('Failed to check in', 500), 500);
    }

    return c.json(successResponse({
      ...data,
      guest_name: guest.name,
    }, 'Check-in successful'), 201);
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

// GET /checkin/event/:event_id
checkin.get('/event/:event_id', async (c) => {
  try {
    const event_id = c.req.param('event_id');
    const supabase = getSupabaseAdmin(c.env);

    const { data, error } = await supabase
      .from('checkins')
      .select(`
        *,
        guests!inner(
          id,
          name,
          event_id
        )
      `)
      .eq('guests.event_id', event_id)
      .order('checked_in_at', { ascending: false });

    if (error) {
      return c.json(errorResponse('Failed to fetch check-ins', 500), 500);
    }

    return c.json(successResponse(data || []));
  } catch (err) {
    return c.json(errorResponse('Internal server error'), 500);
  }
});

export default checkin;
