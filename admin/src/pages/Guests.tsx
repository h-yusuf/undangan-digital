import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function Guests() {
  const { data: guestsWithEvents, isLoading } = useQuery({
    queryKey: ['guests-all'],
    queryFn: async () => {
      const { data } = await supabase
        .from('guests')
        .select(`
          *,
          events (title, slug),
          rsvp (status, message)
        `)
        .order('created_at', { ascending: false })
      return data || []
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">No RSVP</span>
    
    const styles = {
      hadir: 'bg-green-100 text-green-800',
      tidak_hadir: 'bg-red-100 text-red-800',
      ragu: 'bg-yellow-100 text-yellow-800',
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {status === 'hadir' ? 'Hadir' : status === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
      </span>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Guests</h2>

      <div className="card">
        {guestsWithEvents && guestsWithEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RSVP Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guestsWithEvents.map((guest: any) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{guest.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.events?.title}</div>
                      <div className="text-sm text-gray-500">/{guest.events?.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guest.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{guest.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(guest.rsvp?.[0]?.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No guests yet</p>
        )}
      </div>
    </div>
  )
}
