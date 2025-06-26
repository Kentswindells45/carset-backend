import dotenv from "dotenv";
dotenv.config(); 

import Stripe from "stripe";
import Booking from "../models/Booking.mjs";
import Transaction from "../models/Transaction.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export const createStripePayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("client");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Car Rental Payment",
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      metadata: {
        bookingId: booking._id.toString(),
        clientId: booking.client._id.toString(),
      },
    });

    await Transaction.create({
      booking: booking._id,
      client: booking.client._id,
      amount: booking.totalPrice,
      paymentMethod: "stripe",
    });

    res.json({ url: session.url });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Stripe payment failed", error: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const transaction = await Transaction.findOne({ booking: bookingId });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    transaction.status = "paid";
    transaction.commission = transaction.amount * 0.1;
    await transaction.save();

    res.json({ message: "Payment confirmed", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to confirm payment", error: error.message });
  }
};
