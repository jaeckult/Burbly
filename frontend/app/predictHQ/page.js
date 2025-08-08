"use client"
import { useState, useEffect } from 'react';
import Navbar from "../../components/NavBar";

export default function PredictHQPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please enable location access.');
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
    }
  }, []);

  // Default location (Addis Ababa) as fallback
  const defaultLocation = { lat: 9.145, lng: 40.4897 };
  const currentLocation = userLocation || defaultLocation;

  const fetchEvents = async () => {
    if (!location.trim()) {
      setError('Please enter a location to search for events.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`http://localhost:3000/api/predicthq/events?location=${encodeURIComponent(location)}`);
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await res.json();
      setEvents(data.results || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchEvents();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎟️ PredictHQ Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover real-time events and gatherings from around the world
          </p>
        </div>

        {/* Search Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Search for Events
            </h2>
            
            {locationError && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                {locationError}
              </div>
            )}
            
            {isLoadingLocation && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                Getting your location...
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter a city (e.g., Addis Ababa, New York, London)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={fetchEvents}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {loading ? 'Searching...' : 'Search Events'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Events Map
            </h2>
            
            <div className="w-full max-w-4xl h-96 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${currentLocation.lat},${currentLocation.lng}&zoom=10&maptype=roadmap`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PredictHQ Events Map"
              ></iframe>
            </div>
            
            {userLocation && (
              <div className="mt-4 text-center text-sm text-gray-600">
                📍 Map centered on your current location
              </div>
            )}
          </div>
        </div>

        {/* Events List */}
        {events.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Found Events ({events.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    {event.start && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">📅 Start:</span>
                        <span className="ml-2">{formatDate(event.start)}</span>
                      </div>
                    )}
                    
                    {event.end && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">⏰ End:</span>
                        <span className="ml-2">{formatDate(event.end)}</span>
                      </div>
                    )}
                    
                    {event.location && event.location.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">📍 Location:</span>
                        <span className="ml-2">{event.location.join(', ')}</span>
                      </div>
                    )}
                    
                    {event.category && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">🎭 Category:</span>
                        <span className="ml-2">{event.category}</span>
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && location && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No events found for "{location}"</p>
            <p className="text-gray-400 mt-2">Try searching for a different location</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Searching for events...</p>
          </div>
        )}
      </div>
    </div>
  );
}
