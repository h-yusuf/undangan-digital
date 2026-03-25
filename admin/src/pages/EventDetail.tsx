import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { createGuest, generateInvitationLink, type Guest } from '../lib/api'
import { useState } from 'react'

export default function EventDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      return data
    },
  })

  const { data: guests } = useQuery({
    queryKey: ['guests', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  const createGuestMutation = useMutation({
    mutationFn: createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', id] })
      setFormData({ name: '', phone: '', email: '' })
      setShowForm(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !formData.name) return
    
    createGuestMutation.mutate({
      event_id: id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    })
  }

  const copyLink = (guest: Guest) => {
    if (!event) return
    const link = generateInvitationLink(event.slug, guest.name)
    navigator.clipboard.writeText(link)
    setCopiedLink(guest.id)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  if (!event) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-0">
      <Link to="/events" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        ← Back to Events
      </Link>

      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
        <p className="text-gray-500 mb-4">/{event.slug}</p>
        {event.description && (
          <p className="text-gray-700 mb-4">{event.description}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>📅 {new Date(event.date).toLocaleDateString('id-ID')}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Guests ({guests?.length || 0})
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Guest'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={createGuestMutation.isPending}
              className="btn-primary mt-4"
            >
              {createGuestMutation.isPending ? 'Adding...' : 'Add Guest'}
            </button>
          </form>
        )}

        {guests && guests.length > 0 ? (
          <div className="space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{guest.name}</p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    {guest.phone && <span>📱 {guest.phone}</span>}
                    {guest.email && <span>📧 {guest.email}</span>}
                  </div>
                </div>
                <button
                  onClick={() => copyLink(guest)}
                  className="btn-secondary text-sm"
                >
                  {copiedLink === guest.id ? '✓ Copied!' : '🔗 Copy Link'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No guests yet</p>
        )}
      </div>
    </div>
  )
}
