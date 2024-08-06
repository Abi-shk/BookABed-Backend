const express = require('express');
const Booking = require('../models/bookingModel');
const router = express.Router();
require('dotenv').config();

// Initialize Stripe with the secret API key from environment variables
const stripe = require('stripe')(process.env.STRIPE_KEY);

console.log(process.env.STRIPE_KEY);

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  const body = req.body;

  // Create a new Booking document with details from the request
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
    // Save the booking to the database
    await booking.save();
    const price = booking.totoalAmount;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accepts card payments
      line_items: [{
        price_data: {
          currency: 'inr', // Currency in which the payment is made
          product_data: {
            name: 'Flights' // Product name
          },
          unit_amount: price * 100, // Price in the smallest currency unit (e.g., cents for INR)
        },
        quantity: 1 // Quantity of the item
      }],
      mode: 'payment', // One-time payment
      success_url: 'https://book-a-bed.vercel.app/home', // Redirect URL after successful payment
      cancel_url: 'https://book-a-bed.vercel.app/', // Redirect URL if payment is canceled
      metadata: { bookingId: booking._id.toString() } // Store booking ID in metadata
    });

    // Respond with the Stripe session ID
    res.json({ status: true, id: session.id });
  } catch (err) {
    // Handle errors and respond with an error message
    return res.status(401).json({ success: false, message: 'something went wrong', err });
  }
});

module.exports = router;
