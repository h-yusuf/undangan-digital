import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false })
      return data || []
    },
  })

  const { data: guests } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data } = await supabase.from('guests').select('*')
      return data || []
    },
  })

  const { data: rsvps } = useQuery({
    queryKey: ['rsvps'],
    queryFn: async () => {
      const { data } = await supabase.from('rsvp').select('*')
      return data || []
    },
  })

  const stats = [
    { name: 'Total Events', value: events?.length || 0, link: '/events' },
    { name: 'Total Guests', value: guests?.length || 0, link: '/guests' },
    { name: 'Total RSVP', value: rsvps?.length || 0, link: '/guests' },
    { 
      name: 'Confirmed', 
      value: rsvps?.filter(r => r.status === 'hadir').length || 0,
      link: '/guests'
    },
  ]

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="card hover:shadow-md transition-shadow"
          >
            <dt className="text-sm font-medium text-gray-500 truncate">
              {stat.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stat.value}
            </dd>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
        <div className="card">
          {events && events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">/{event.slug}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
