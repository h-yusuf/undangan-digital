import { Hono } from 'hono';
import { getSupabaseClient } from '../services/supabase';
import { successResponse, errorResponse } from '../utils/response';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const analytics = new Hono<{ Bindings: Bindings }>();

// GET /analytics/event/:event_id
analytics.get('/event/:event_id', async (c) => {
  try {
    const event_id = c.req.param('event_id');
    const supabase = getSupabaseClient(c.env);

    // Get total guests
    const { count: totalGuests } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event_id);

    // Get RSVP stats
    const { data: rsvpData } = await supabase
      .from('rsvp')
      .select(`
        status,
        guests!inner(event_id)
      `)
      .eq('guests.event_id', event_id);

    const rsvpStats = {
      hadir: rsvpData?.filter(r => r.status === 'hadir').length || 0,
      tidak_hadir: rsvpData?.filter(r => r.status === 'tidak_hadir').length || 0,
      ragu: rsvpData?.filter(r => r.status === 'ragu').length || 0,
      belum_rsvp: (totalGuests || 0) - (rsvpData?.length || 0),
    };

    // Get check-in stats (if table exists)
    let checkinStats = { total: 0 };
    try {
      const { count: checkedIn } = await supabase
        .from('checkins')
        .select(`
          *,
          guests!inner(event_id)
        `, { count: 'exact', head: true })
        .eq('guests.event_id', event_id);
      
      checkinStats.total = checkedIn || 0;
    } catch (e) {
      // Table might not exist yet
    }

    // Get recent activity
    const { data: recentRSVP } = await supabase
      .from('rsvp')
      .select(`
        id,
        status,
        created_at,
        guests!inner(
          name,
          event_id
        )
      `)
      .eq('guests.event_id', event_id)
      .order('created_at', { ascending: false })
      .limit(10);

    return c.json(successResponse({
      total_guests: totalGuests || 0,
      rsvp_stats: rsvpStats,
      checkin_stats: checkinStats,
      recent_activity: recentRSVP || [],
      response_rate: totalGuests 
        ? Math.round(((rsvpData?.length || 0) / totalGuests) * 100) 
        : 0,
    }));
  } catch (err) {
    console.error('Analytics error:', err);
    return c.json(errorResponse('Failed to fetch analytics'), 500);
  }
});

// GET /analytics/dashboard
analytics.get('/dashboard', async (c) => {
  try {
    const supabase = getSupabaseClient(c.env);

    // Get total events
    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    // Get total guests
    const { count: totalGuests } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true });

    // Get total RSVPs
    const { count: totalRSVPs } = await supabase
      .from('rsvp')
      .select('*', { count: 'exact', head: true });

    // Get recent events
    const { data: recentEvents } = await supabase
      .from('events')
      .select('id, title, slug, date')
      .order('created_at', { ascending: false })
      .limit(5);

    return c.json(successResponse({
      total_events: totalEvents || 0,
      total_guests: totalGuests || 0,
      total_rsvps: totalRSVPs || 0,
      recent_events: recentEvents || [],
    }));
  } catch (err) {
    return c.json(errorResponse('Failed to fetch dashboard analytics'), 500);
  }
});

export default analytics;
