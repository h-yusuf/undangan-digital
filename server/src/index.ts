import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import event from './routes/event';
import guest from './routes/guest';
import rsvp from './routes/rsvp';
import checkin from './routes/checkin';
import analytics from './routes/analytics';
import { cacheMiddleware } from './middleware/cache';
import { rateLimit } from './middleware/rateLimit';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());
app.use('/*', compress());

app.use('/event/*', cacheMiddleware(600));

app.use('/guest', rateLimit({ windowMs: 60000, maxRequests: 10 }));
app.use('/rsvp', rateLimit({ windowMs: 60000, maxRequests: 5 }));

app.get('/', (c) => {
  return c.json({ 
    message: 'Undangan Digital API',
    version: '1.0.0',
    endpoints: {
      events: '/event/:slug',
      guests: '/guest/:id',
      createGuest: 'POST /guest',
      rsvp: 'POST /rsvp',
    }
  });
});

app.route('/event', event);
app.route('/guest', guest);
app.route('/rsvp', rsvp);
app.route('/checkin', checkin);
app.route('/analytics', analytics);

export default app;
