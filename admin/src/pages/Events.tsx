import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
      </div>

      <div className="card">
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block hover:bg-gray-50 p-4 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      /{event.slug}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>📅 {new Date(event.date).toLocaleDateString('id-ID')}</span>
                      {event.location && <span>📍 {event.location}</span>}
                    </div>
                  </div>
                  <span className="text-primary-600 hover:text-primary-700">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
