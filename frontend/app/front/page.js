"use client";
import Navbar from "../../components/NavBar";
import React, { useEffect, useState } from "react";

function front(){
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mapUrl, setMapUrl] = useState('');

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

    // Default location (New York City) as fallback
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    const currentLocation = userLocation || defaultLocation;

    // Update map URL when location changes
    useEffect(() => {
        const url = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${currentLocation.lat},${currentLocation.lng}&zoom=13&maptype=roadmap`;
        setMapUrl(url);
    }, [currentLocation]);

    const fetchCustomEvents = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/customEvent');
            if (res.ok) {
                const data = await res.json();
                return data.events || [];
            }
        } catch (error) {
            console.error('Error fetching custom events:', error);
        }
        return [];
    };

    const fetchGooglePlaces = async (location) => {
        try {
            const res = await fetch(`http://localhost:3000/api/places?lat=${currentLocation.lat}&lng=${currentLocation.lng}&keyword=events`);
            if (res.ok) {
                const data = await res.json();
                return data.results || [];
            }
        } catch (error) {
            console.error('Error fetching Google Places:', error);
        }
        return [];
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        
        try {
            // Fetch from all sources
            const [predictHQRes, customEvents, places] = await Promise.all([
                fetch(`http://localhost:3000/api/predicthq/events?location=${encodeURIComponent(searchQuery)}`),
                fetchCustomEvents(),
                fetchGooglePlaces(searchQuery)
            ]);

            let allEvents = [];

            // Process PredictHQ events
            if (predictHQRes.ok) {
                const predictHQData = await predictHQRes.json();
                const predictHQEvents = (predictHQData.results || []).map(event => ({
                    ...event,
                    source: 'PredictHQ',
                    type: 'event'
                }));
                allEvents.push(...predictHQEvents);
            }

            // Process custom events
            const customEventsWithSource = customEvents.map(event => ({
                ...event,
                source: 'Custom Events',
                type: 'event',
                title: event.title,
                start: event.startTime,
                end: event.endTime,
                location: event.location ? [event.location] : []
            }));
            allEvents.push(...customEventsWithSource);

            // Process Google Places
            const placesWithSource = places.map(place => ({
                ...place,
                source: 'Google Places',
                type: 'place',
                title: place.name,
                start: null,
                end: null,
                location: place.vicinity ? [place.vicinity] : [],
                description: place.types ? place.types.join(', ') : '',
                category: 'Place',
                rating: place.rating,
                photo: place.photo
            }));
            allEvents.push(...placesWithSource);

            setEvents(allEvents);
            
            // Update map to show search location
            if (allEvents.length > 0) {
                const firstEvent = allEvents[0];
                if (firstEvent.lat && firstEvent.lng) {
                    const searchMapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${firstEvent.lat},${firstEvent.lng}&zoom=12&maptype=roadmap`;
                    setMapUrl(searchMapUrl);
                } else {
                    // Use search query for map center
                    const searchMapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}&zoom=12&maptype=roadmap`;
                    setMapUrl(searchMapUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSourceIcon = (source) => {
        switch (source) {
            case 'PredictHQ': return '🎟️';
            case 'Custom Events': return '🎉';
            case 'Google Places': return '📍';
            default: return '📅';
        }
    };

    const getSourceColor = (source) => {
        switch (source) {
            case 'PredictHQ': return 'bg-blue-100 text-blue-800';
            case 'Custom Events': return 'bg-green-100 text-green-800';
            case 'Google Places': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return(
        <div className="min-h-screen bg-white">
            {/* Hero Section with Integrated Navigation */}
            <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 ">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                    <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full opacity-20"></div>
                </div>

                {/* Navigation */}
                <div className="relative z-20">
                    <Navbar />
                </div>

                {/* Enhanced Search Bar */}
                <div className="w-full max-w-4xl mx-auto mb-16">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2 flex items-center">
                        <div className="flex-1 px-8 py-6">
                            <input
                                type="text"
                                placeholder="Where do you want to find events?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-xl bg-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-6 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            {loading ? 'Searching...' : 'Search Events'}
                        </button>
                    </div>
                </div>

                {/* Hero Content - Commented Out
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-4 pt-20">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
                            Find Amazing Events
                        </h1>
                        <p className="text-2xl md:text-3xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
                            Discover the best events happening around you. From concerts to meetups, find your next adventure and connect with amazing people.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">1000+</div>
                                <div className="text-white/80">Events Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">50+</div>
                                <div className="text-white/80">Cities Covered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-2">24/7</div>
                                <div className="text-white/80">Real-time Updates</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
                */}
            </div>

            {/* Map Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Explore Events Near You
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {events.length > 0 
                                ? `Found ${events.length} events and places in your search area`
                                : 'Search for events to see them displayed on the map'
                            }
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {locationError && (
                                <div className="p-4 bg-yellow-100 border-b border-yellow-200 text-yellow-800">
                                    {locationError}
                                </div>
                            )}
                            
                            {isLoadingLocation && (
                                <div className="p-4 bg-blue-100 border-b border-blue-200 text-blue-800">
                                    Getting your location...
                                </div>
                            )}
                            
                            <div className="h-96 w-full">
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Burbly Events Map"
                                ></iframe>
                            </div>
                            
                            {userLocation && (
                                <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                                    📍 Map centered on your current location
                                    {events.length > 0 && ` • ${events.length} events and places found`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Section */}
            {events.length > 0 && (
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Events & Places Found ({events.length})
                            </h2>
                            <p className="text-lg text-gray-600">
                                Discover amazing events and places happening in your area
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {events.map((event, index) => (
                                <div key={`${event.source}-${event.id || index}`} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                    {/* Event Image */}
                                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
                                        {event.photo ? (
                                            <img 
                                                src={event.photo} 
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-4xl">{getSourceIcon(event.source)}</span>
                                        )}
                                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getSourceColor(event.source)}`}>
                                            {event.source}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                            {event.title}
                                        </h3>
                                        
                                        <div className="space-y-2 mb-4">
                                            {event.start && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium">📅</span>
                                                    <span className="ml-2">{formatDate(event.start)}</span>
                                                </div>
                                            )}
                                            
                                            {event.location && event.location.length > 0 && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium">📍</span>
                                                    <span className="ml-2">{event.location.join(', ')}</span>
                                                </div>
                                            )}
                                            
                                            {event.category && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium">🎭</span>
                                                    <span className="ml-2">{event.category}</span>
                                                </div>
                                            )}

                                            {event.rating && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <span className="font-medium">⭐</span>
                                                    <span className="ml-2">{event.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {event.description && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                {event.description}
                                            </p>
                                        )}
                                        
                                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Features Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Why Choose Burbly?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your ultimate platform for discovering and creating amazing events
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
                            <p className="text-gray-600">
                                Find exciting events happening around you, from concerts to meetups and everything in between.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Connect</h3>
                            <p className="text-gray-600">
                                Meet new people who share your interests and passions. Build meaningful connections.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create Events</h3>
                            <p className="text-gray-600">
                                Host your own events and bring people together. Share your passion with the world.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default front;
