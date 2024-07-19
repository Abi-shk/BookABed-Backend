// routes/booking.js

const express = require('express');
const Booking = require('../models/bookingModel');
const router = express.Router();

router.get('/all/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const booking = await Booking.find({userId: req.params.id});
    console.log(booking)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
