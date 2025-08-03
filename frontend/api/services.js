// api/services.js

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const DEFAULT_LOCATION = '51.5560,-0.2795'; // Wembley Stadium
const RADIUS = 2000; // in meters

const BASE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const BASE_PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo';

const categories = [
  { name: 'Photography', type: 'point_of_interest', keyword: 'photography' },
  { name: 'Chefs', type: 'restaurant', keyword: 'private chef' },
  { name: 'Massage', type: 'spa', keyword: 'massage therapist' },
  { name: 'Makeup', type: 'beauty_salon', keyword: 'makeup artist' },
  { name: 'Hair', type: 'beauty_salon', keyword: 'hairdresser' },
  { name: 'Spa treatments', type: 'spa', keyword: 'spa' },
  { name: 'Catering', type: 'restaurant', keyword: 'catering' },
  { name: 'Nails', type: 'beauty_salon', keyword: 'nail salon' },
];

/**
 * Fetch category services using Google Places API
 */
async function fetchCategory(category) {
  const params = new URLSearchParams({
    location: DEFAULT_LOCATION,
    radius: RADIUS,
    type: category.type,
    keyword: category.keyword,
    key: GOOGLE_API_KEY,
  });

  const res = await fetch(`${BASE_PLACES_URL}?${params.toString()}`);
  const data = await res.json();

  return {
    name: category.name,
    available: data.results.length,
    services: data.results.slice(0, 6).map(place => ({
      title: place.name,
      rating: place.rating || null,
      address: place.vicinity,
      price: null, // Google Places doesn't give price; can be AI-enriched later
      price_type: 'guest',
      is_popular: (place.user_ratings_total || 0) > 50,
      image_url: place.photos?.[0]
        ? `${BASE_PHOTO_URL}?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : null,
      place_id: place.place_id,
    })),
  };
}

/**
 * Fetch all service categories
 */
export async function getAllServiceCategories() {
  const categoryResults = await Promise.all(categories.map(fetchCategory));

  return {
    location: 'Wembley Stadium',
    categories: categoryResults,
  };
}
