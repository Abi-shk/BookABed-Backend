const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { MONGO_URI } = require('./config/config');

const app = express();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/todo', todoRoutes);

const clientId = 'xfP5absRlbBi1oQRWWQd48uvdeXoaiwE'; // Replace with your API Key
const clientSecret = 'bOAO6f3xru5o4HW6'; // Replace with your API Secret

// Fetch and cache the token
let tokenCache = null;

const getToken = async () => {
  if (tokenCache) {
    return tokenCache;
  }

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    tokenCache = response.data.access_token;

    // Set a timeout to clear the token cache when it expires
    setTimeout(() => {
      tokenCache = null;
    }, response.data.expires_in * 1000);

    return tokenCache;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Unable to fetch access token');
  }
};

// Endpoint to handle hotel offers request
app.get('/api/hotel-offers', async (req, res) => {
  try {
    const token = await getToken();
    const { cityCode, checkInDate, checkOutDate, roomQuantity, adults, currency, radius, radiusUnit, amenities, hotelSource } = req.query;

    const response = await axios.get('https://test.api.amadeus.com/v1/shopping/hotel-offers', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        cityCode,
        checkInDate,
        checkOutDate,
        roomQuantity,
        adults,
        currency,
        radius,
        radiusUnit,
        amenities,
        hotelSource,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotel offers:', error);
    res.status(500).json({ error: 'Error fetching hotel offers' });
  }
});

module.exports = app;
