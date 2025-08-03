"use client";
import React, { useEffect, useState } from "react";

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async (lat, lng) => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/places?lat=${lat}&lng=${lng}&keyword=photography`
        );
        const data = await res.json();
        setPlaces(data.results || []);
      } catch (err) {
        console.error("Error fetching places:", err);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchPlaces(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to default location
          fetchPlaces(51.5560, -0.2795);
        }
      );
    } else {
      console.error("Geolocation not supported.");
      fetchPlaces(51.5560, -0.2795);
    }
  }, []);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>
        Nearby Photography Spots
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {places.map((place, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "0.5rem",
                padding: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {place.name}
              </h3>
              <p style={{ color: "#555" }}>{place.vicinity}</p>
              {place.rating && (
                <p style={{ color: "#DAA520" }}>⭐ {place.rating}</p>
              )}
              {place.photo && (
                <img
                  src={place.photo}
                  alt={place.name}
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
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

export default Places;
