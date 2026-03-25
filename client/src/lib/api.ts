const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8787';

export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  status: 'hadir' | 'tidak_hadir' | 'ragu';
  message?: string;
  created_at: string;
  updated_at: string;
}

export async function getEvent(slug: string): Promise<Event | null> {
  try {
    const res = await fetch(`${API_URL}/event/${slug}`);
    const json = await res.json();
    
    if (!json.success) {
      return null;
    }
    
    return json.data;
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return null;
  }
}

export async function getGuest(id: string): Promise<Guest | null> {
  try {
    const res = await fetch(`${API_URL}/guest/${id}`);
    const json = await res.json();
    
    if (!json.success) {
      return null;
    }
    
    return json.data;
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    return null;
  }
}

export async function submitRSVP(data: {
  guest_id: string;
  status: 'hadir' | 'tidak_hadir' | 'ragu';
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_URL}/rsvp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    return {
      success: json.success,
      message: json.message,
    };
  } catch (error) {
    console.error('Failed to submit RSVP:', error);
    return {
      success: false,
      message: 'Gagal mengirim konfirmasi',
    };
  }
}

export async function getRSVP(guestId: string): Promise<RSVP | null> {
  try {
    const res = await fetch(`${API_URL}/rsvp/guest/${guestId}`);
    const json = await res.json();
    
    if (!json.success) {
      return null;
    }
    
    return json.data;
  } catch (error) {
    console.error('Failed to fetch RSVP:', error);
    return null;
  }
}
