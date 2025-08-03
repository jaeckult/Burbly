// controllers/googlePlaces.js
const express = require('express');
const axios = require('axios');
const googlePlacesRouter = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

googlePlacesRouter.get('/places', async (req, res) => {
  const { lat, lng, radius = 2000, keyword = '', type = 'point_of_interest' } = req.query;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params: {
          location: `${lat},${lng}`,
          radius,
          keyword,
          type,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const places = response.data.results.map(place => {
      let photo = null;
      if (place.photos && place.photos.length > 0) {
        const ref = place.photos[0].photo_reference;
        photo = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_API_KEY}`;
      }
      return {
        ...place,
        photo,
      };
    });

    res.json({
      ...response.data,
      results: places,
    });
  } catch (error) {
    console.error('Error fetching from Google Places API:', error.message);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

module.exports = googlePlacesRouter;