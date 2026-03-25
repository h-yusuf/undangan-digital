const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export interface Event {
  id: string
  slug: string
  title: string
  date: string
  location?: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  event_id: string
  name: string
  phone?: string
  email?: string
  created_at: string
}

export interface RSVP {
  id: string
  guest_id: string
  status: 'hadir' | 'tidak_hadir' | 'ragu'
  message?: string
  created_at: string
  updated_at: string
}

export async function createGuest(data: {
  event_id: string
  name: string
  phone?: string
  email?: string
}): Promise<{ success: boolean; data?: Guest; message: string }> {
  try {
    const res = await fetch(`${API_URL}/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    const json = await res.json()
    return {
      success: json.success,
      data: json.data,
      message: json.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create guest',
    }
  }
}

export function generateInvitationLink(slug: string, guestName: string): string {
  const baseUrl = window.location.origin.replace(':3000', ':4321')
  return `${baseUrl}/${slug}?to=${encodeURIComponent(guestName)}`
}
