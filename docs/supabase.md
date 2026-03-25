# Database Design (Supabase)

## Tables

### events
- id
- slug
- title
- date

### guests
- id
- event_id
- name
- phone

### rsvp
- id
- guest_id
- status

---

## Relationships

events → guests → rsvp

---

## Notes

- gunakan foreign key
- index slug untuk cepat query