import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export default function Analytics() {
  const { id } = useParams()

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/analytics/event/${id}`)
      const json = await res.json()
      return json.data
    },
    enabled: !!id,
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data</div>
  }

  const { total_guests, rsvp_stats, response_rate, recent_activity } = analytics

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">Total Guests</p>
          <p className="text-3xl font-bold text-gray-900">{total_guests}</p>
        </div>

        <div className="card bg-green-50">
          <p className="text-sm text-gray-500">Hadir</p>
          <p className="text-3xl font-bold text-green-600">{rsvp_stats.hadir}</p>
        </div>

        <div className="card bg-red-50">
          <p className="text-sm text-gray-500">Tidak Hadir</p>
          <p className="text-3xl font-bold text-red-600">{rsvp_stats.tidak_hadir}</p>
        </div>

        <div className="card bg-yellow-50">
          <p className="text-sm text-gray-500">Ragu-ragu</p>
          <p className="text-3xl font-bold text-yellow-600">{rsvp_stats.ragu}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Response Rate</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-primary-600">
                  {response_rate}% Responded
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {rsvp_stats.belum_rsvp} Pending
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${response_rate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              ></div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">✅ Confirmed</span>
              <span className="font-semibold">{rsvp_stats.hadir}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">❌ Declined</span>
              <span className="font-semibold">{rsvp_stats.tidak_hadir}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">❓ Maybe</span>
              <span className="font-semibold">{rsvp_stats.ragu}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">⏳ No Response</span>
              <span className="font-semibold">{rsvp_stats.belum_rsvp}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recent_activity && recent_activity.length > 0 ? (
              recent_activity.map((activity: any) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.guests?.name}</p>
                    <p className="text-sm text-gray-600">
                      {activity.status === 'hadir' && '✅ Confirmed attendance'}
                      {activity.status === 'tidak_hadir' && '❌ Declined'}
                      {activity.status === 'ragu' && '❓ Maybe attending'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
