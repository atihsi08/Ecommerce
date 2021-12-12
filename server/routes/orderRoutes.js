import express from 'express';
import { orderController } from '../controllers/orderControllers.js';
import { auth } from '../middlewares/auth.js';
import { authAdmin } from '../middlewares/authAdmin.js';

export const orderRouter = express.Router();

orderRouter.post('/new', auth, orderController.createOrder);

orderRouter.get('/user', auth, orderController.loggedUserOrders);

orderRouter.get('/all', auth, authAdmin, orderController.getAllOrders);

orderRouter.get('/:id', auth, orderController.getSingleOrder);

orderRouter.put('/update/:id', auth, authAdmin, orderController.updateOrderStatus);

orderRouter.delete('/delete/:id', auth, authAdmin, orderController.deleteOrder);
