"use client"

import { useEffect, useState } from "react"
import { getCustomEvent, addCustomEvent } from "../../api/customEvent"

export default function CustomEventPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getCustomEvent()
        if (data) {
          setEvents(data)
        } else {
          setEvents([])
        }
      } catch (err) {
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return <div className="p-4 text-gray-500">Loading events...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Custom Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">No events found</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{event.title}</h2>
              {event.description && (
                <p className="text-gray-600">{event.description}</p>
              )}
              <div className="text-sm text-gray-500">
                {event.location} • {new Date(event.startTime).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
