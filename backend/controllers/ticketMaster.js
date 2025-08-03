const express = require('express');
const axios = require('axios');
const ticketmasterRouter = express.Router();

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY; // Add this to your .env

// GET /api/ticketmaster/events?keyword=&lat=&lng=&radius=&classificationName=
ticketmasterRouter.get('/events', async (req, res) => {
  const {
    keyword = '',
    lat,
    lng,
    radius = 10,
    classificationName = '',
    size = 20,
  } = req.query;

  const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';

  const params = {
    apikey: TICKETMASTER_API_KEY,
    keyword,
    classificationName,
    size,
  };

  if (lat && lng) {
    params.latlong = `${lat},${lng}`;
    params.radius = radius;
    params.unit = 'km';
  }

  try {
    const response = await axios.get(baseUrl, { params });

    const events = response.data._embedded?.events || [];

    const simplified = events.map(event => ({
      id: event.id,
      name: event.name,
      url: event.url,
      image: event.images?.[0]?.url,
      dates: event.dates?.start,
      venue: event._embedded?.venues?.[0]?.name,
      city: event._embedded?.venues?.[0]?.city?.name,
      country: event._embedded?.venues?.[0]?.country?.name,
      genre: event.classifications?.[0]?.genre?.name,
      priceRanges: event.priceRanges || null,
    }));

    res.json(simplified);
    console.log(simplified);
  } catch (error) {
    console.error('Ticketmaster API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Ticketmaster events.' });
  }
});

module.exports = ticketmasterRouter;
