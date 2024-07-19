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

module.exports = app;
