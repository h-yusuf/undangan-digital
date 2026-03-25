# 🔐 Security Guide

Panduan keamanan untuk production deployment.

---

## 🛡️ Input Validation

### Server-Side Validation

**Semua input divalidasi di middleware:**

```ts
// Guest input validation
- event_id: required, string
- name: required, string, max 100 chars
- phone: optional, string
- email: optional, string, valid email format

// RSVP input validation
- guest_id: required, string
- status: required, enum ['hadir', 'tidak_hadir', 'ragu']
- message: optional, string, max 500 chars

// Slug validation
- Format: lowercase alphanumeric + hyphens
- Length: 1-100 characters
```

### Input Sanitization

**Semua user input di-sanitize:**
- Trim whitespace
- Remove HTML tags (`<>`)
- Limit length (max 1000 chars)

```ts
const sanitizedInput = input
  .trim()
  .replace(/[<>]/g, '')
  .substring(0, 1000);
```

---

## 🚦 Rate Limiting

### API Rate Limits

**Configured per endpoint:**

```ts
// Guest endpoints: 10 requests/minute
app.use('/guest', rateLimit({ 
  windowMs: 60000, 
  maxRequests: 10 
}));

// RSVP endpoints: 5 requests/minute
app.use('/rsvp', rateLimit({ 
  windowMs: 60000, 
  maxRequests: 5 
}));
```

**Response headers:**
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 2024-01-01T12:00:00.000Z
```

### Cloudflare Rate Limiting (Production)

**Additional protection via Cloudflare Dashboard:**

1. Go to Security → WAF → Rate limiting rules
2. Create rule:
   - **Name**: API Protection
   - **If incoming requests match**: 
     - URI Path contains `/api/`
   - **Then**: 
     - Block for 1 hour
     - When rate exceeds 100 requests per minute

---

## 🔑 API Key Protection

### Environment Variables

**NEVER commit secrets to git:**

```bash
# ❌ WRONG - hardcoded
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ✅ CORRECT - environment variable
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
```

### Cloudflare Workers Secrets

```bash
# Set secrets via CLI
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

### Client-Side Safety

**Only use anon key in frontend:**

```ts
// ✅ SAFE - anon key (protected by RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// ❌ NEVER - service role in frontend
const supabase = createClient(
  url,
  serviceRoleKey // NEVER DO THIS!
);
```

---

## 🔒 Database Security (Supabase)

### Row Level Security (RLS)

**All tables have RLS enabled:**

```sql
-- Events: Public read
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Guests: Authenticated write
CREATE POLICY "Guests can be created by authenticated users"
  ON guests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RSVP: Authenticated write
CREATE POLICY "RSVP can be created by authenticated users"
  ON rsvp FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### SQL Injection Prevention

**Supabase client uses parameterized queries:**

```ts
// ✅ SAFE - parameterized
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('slug', userInput);

// ❌ NEVER - raw SQL with user input
const { data } = await supabase
  .rpc('raw_query', { 
    query: `SELECT * FROM events WHERE slug = '${userInput}'` 
  });
```

---

## 🌐 CORS Configuration

### Allowed Origins

**Production CORS setup:**

```ts
app.use('/*', cors({
  origin: [
    'https://yourdomain.com',
    'https://admin.yourdomain.com',
  ],
  credentials: true,
}));
```

**Development:**
```ts
app.use('/*', cors()); // Allow all origins
```

---

## 🔐 Authentication (Admin)

### Supabase Auth

**Admin dashboard protected:**

```tsx
// src/lib/auth.ts
import { supabase } from './supabase';

export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    window.location.href = '/login';
    return null;
  }
  
  return session;
}
```

**Protected routes:**
```tsx
// src/components/ProtectedRoute.tsx
export function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);
  
  if (!session) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

---

## 🛡️ XSS Protection

### Content Security Policy

**Add CSP headers:**

```ts
// server/src/index.ts
app.use('/*', async (c, next) => {
  await next();
  c.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co;"
  );
});
```

### Output Encoding

**React automatically escapes:**
```tsx
// ✅ SAFE - React escapes by default
<p>{userInput}</p>

// ❌ DANGEROUS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 🔒 HTTPS Enforcement

### Force HTTPS

**Netlify:**
```toml
# netlify.toml
[[redirects]]
  from = "http://*"
  to = "https://:splat"
  status = 301
  force = true
```

**Cloudflare Workers:**
```ts
app.use('/*', async (c, next) => {
  if (c.req.header('x-forwarded-proto') !== 'https') {
    return c.redirect(`https://${c.req.header('host')}${c.req.path}`);
  }
  await next();
});
```

---

## 📊 Security Headers

### Recommended Headers

```ts
app.use('/*', async (c, next) => {
  await next();
  
  // Prevent clickjacking
  c.header('X-Frame-Options', 'DENY');
  
  // XSS protection
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  c.header('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=()'
  );
});
```

---

## 🔍 Monitoring & Logging

### Error Logging

**Don't expose sensitive info:**

```ts
// ❌ BAD - exposes internal details
return c.json({ 
  error: error.message,
  stack: error.stack 
});

// ✅ GOOD - generic message
return c.json({ 
  error: 'Internal server error' 
});

// Log internally
console.error('[ERROR]', {
  message: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString(),
});
```

### Audit Logs

**Track important actions:**

```ts
// Log RSVP submissions
console.log('[AUDIT]', {
  action: 'RSVP_CREATED',
  guest_id: guest_id,
  status: status,
  ip: c.req.header('cf-connecting-ip'),
  timestamp: new Date().toISOString(),
});
```

---

## 🚨 Incident Response

### Security Checklist

**If breach detected:**

1. **Immediate Actions:**
   - [ ] Rotate all API keys
   - [ ] Review access logs
   - [ ] Disable compromised accounts
   - [ ] Block suspicious IPs

2. **Investigation:**
   - [ ] Check Cloudflare logs
   - [ ] Review Supabase audit logs
   - [ ] Identify attack vector
   - [ ] Document timeline

3. **Recovery:**
   - [ ] Patch vulnerabilities
   - [ ] Update security policies
   - [ ] Notify affected users (if needed)
   - [ ] Implement additional monitoring

### Emergency Contacts

- **Cloudflare Support**: support.cloudflare.com
- **Supabase Support**: support@supabase.io
- **Netlify Support**: support.netlify.com

---

## ✅ Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] RLS policies enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection implemented
- [ ] Error messages sanitized

### Post-Deployment

- [ ] Monitor error logs daily
- [ ] Review access logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Security audit annually
- [ ] Backup database weekly
- [ ] Test disaster recovery plan

---

## 🔧 Security Tools

### Automated Scanning

```bash
# Dependency vulnerability scan
npm audit

# Fix vulnerabilities
npm audit fix

# OWASP ZAP for penetration testing
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://yourdomain.com
```

### Manual Testing

1. **SQL Injection**: Try `' OR '1'='1` in inputs
2. **XSS**: Try `<script>alert('xss')</script>`
3. **CSRF**: Test without CORS headers
4. **Rate Limiting**: Spam requests
5. **Auth Bypass**: Access protected routes

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Cloudflare Security](https://www.cloudflare.com/learning/security/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

Security implemented! 🔒
