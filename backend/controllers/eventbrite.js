// // routes/eventbrite.js
// const express = require('express');
// const axios = require('axios');

// const eventbriteRouter = express.Router();



// eventbriteRouter.get('/events', async (req, res) => {
//     console.log("Eventbrite API request received");
//   const { location = 'Addis Ababa' } = req.query;
//   const token = process.env.EVENTBRITE_TOKEN;
//   console.log(token);
  

//   try {
//     const response = await axios.get('https://www.eventbriteapi.com/v3/users/me/?token/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       params: {
//         'location.address': location,
//         expand: 'venue,logo',
//       },
      
//     });
//     console.log(response.data);

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Eventbrite API Error:', error.response?.data || error.message);
//     res.status(error.response?.status || 500).json({
//       error: error.response?.data || 'Failed to fetch events',
//     });
//   }
// });

// module.exports = eventbriteRouter;
