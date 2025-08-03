const express = require('express');
const axios = require('axios');
const predictHQRouter = express.Router();

const PREDICTHQ_BASE_URL = 'https://api.predicthq.com/v1/events';
const ACCESS_TOKEN = process.env.PREDICTHQ_ACCESS_TOKEN;

predictHQRouter.get('/events', async (req, res) => {

  const { location = 'new york', category = 'concerts', limit = 10 } = req.query;

  try {
    const response = await axios.get(PREDICTHQ_BASE_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json'
      },
      params: {
        q: location,
        category,
        limit
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('PredictHQ error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch PredictHQ events' });
  }
});

module.exports = predictHQRouter;
