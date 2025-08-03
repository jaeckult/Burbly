"use client"
import { useState } from 'react';

export default function PredictHQPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Addis Ababa');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/predicthq/events?location=${location}`);
      const data = await res.json();
      setEvents(data.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem'}}>
      <h1>🎟️ PredictHQ Events</h1>

      <input
        type="text"
        placeholder="Enter a city"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={fetchEvents} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading events...</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: '1rem' }}>
            <strong>{event.title}</strong> <br />
            <em>{event.start}</em> <br />
            {event.location && (
              <span>📍 {event.location.join(', ')}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
