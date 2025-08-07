"use client";
import React, { useEffect, useState } from "react";

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async (lat, lng) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/places?lat=${lat}&lng=${lng}&keyword=photography`
      );
      const data = await res.json();
      setPlaces(data?.results || []);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetchPlaces(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          // Fallback: London
          fetchPlaces(51.5560, -0.2795);
        }
      );
    } else {
      console.warn("Geolocation not supported.");
      fetchPlaces(51.5560, -0.2795);
    }
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "1rem" }}>
        Nearby Photography Spots
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => window.location.href = '/ticketmaster'}
          style={buttonStyle}
        >
          🎟️ Ticketmaster
        </button>

        <button
          onClick={() => window.location.href = '/predictHQ'}
          style={buttonStyle}
        >
          🔮 PredictHQ
        </button>
        <button
          onClick={() => window.location.href = '/customEvents'}
          style={buttonStyle}
        >
          🔮 custom event
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {places.map((place, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "0.75rem",
                padding: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {place.name}
              </h3>
              <p style={{ color: "#444" }}>{place.vicinity}</p>
              {place.rating && (
                <p style={{ color: "#DAA520", fontWeight: "500" }}>
                  ⭐ {place.rating}
                </p>
              )}
              {place.photo && (
                <img
                  src={place.photo}
                  alt={place.name}
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                    height: "150px",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "0.5rem 1.25rem",
  fontSize: "1rem",
  fontWeight: "500",
  borderRadius: "0.5rem",
  backgroundColor: "#222",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default Places;
