const express = require('express');
const Booking = require('../models/bookingModel');
const router = express.Router();
require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_KEY);

console.log(process.env.STRIPE_KEY)

router.post('/create-checkout-session', async (req, res) => {
  const body = req.body;
  const booking = new Booking({
    totoalAmount: body.travelerPricings[0].price.total,
    from: body.itineraries[0].segments[0].departure.iataCode,
    to: body.itineraries[0].segments[0].arrival.iataCode,
    departureTime: body.itineraries[0].segments[0].departure.at,
    arrivalTime: body.itineraries[0].segments[0].arrival.at,
    duration: body.itineraries[0].duration,
    orderedBy: body.user.firstName,
    userId: body.user.userId
  });

  try {
    await booking.save();
    const price = booking.totoalAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Flights'
          },
          unit_amount: price * 100,
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'http://localhost:5173/paymentSuccess',
      cancel_url: 'http://localhost:5173/',
      metadata: { bookingId: booking._id.toString() } // Store booking ID in metadata
    });

    res.json({ status: true, id: session.id });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'something went wrong', err });
  }
});



module.exports = router;
