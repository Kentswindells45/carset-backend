require("dotenv").config(); 
const stripe = require("stripe")(process.env.STRIPE_KEY); 

exports.processStripePayment = async (token, amount) => {
  try {
    const charge = await stripe.charges.create({
      amount: amount * 100, 
      currency: "GHS",
      source: token,
      description: "CarSet booking payment",
    });
    return { status: "success", charge };
  } catch (err) {
    return { status: "failed", error: err.message };
  }
};
