import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentController = {
    processPayment: async (req, res) => {
        try {
            const myPayment = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: "inr",
                metadata: {
                    company: "Ecommerce",
                }
            });

            res.status(200).json({ success: true, client_secret: myPayment.client_secret });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    sendStripeApiKey: async (req, res) => {
        try {
            res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}