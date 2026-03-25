import { Hono } from 'hono';
import { cors } from 'hono/cors';
import event from './routes/event';
import guest from './routes/guest';
import rsvp from './routes/rsvp';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

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

export default app;
