import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { auth } from '../middlewares/auth.js';

export const paymentRouter = express.Router();

paymentRouter.post('/processPayment', auth, paymentController.processPayment);

paymentRouter.get('/stripeApiKey', auth, paymentController.sendStripeApiKey)