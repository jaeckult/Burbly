"use client";
import { useEffect, useState } from "react";

export default function Ticketmaster() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ticketmaster/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎫 Ticketmaster Events</h1>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <img
              src={event.image}
              alt={event.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h3>{event.name}</h3>
            <p>
              {event.city}, {event.country}
            </p>
            <p>
              {event.dates?.localDate} {event.dates?.localTime}
            </p>
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
