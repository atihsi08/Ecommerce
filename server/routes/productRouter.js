import express from 'express';
import { productController } from '../controllers/productController.js';
import { auth } from '../middlewares/auth.js';
import { authAdmin } from '../middlewares/authAdmin.js';

export const productRouter = express.Router();

productRouter.get('/', productController.getProducts);

productRouter.get('/reviews', auth, authAdmin, productController.productAllReviews);

productRouter.get('/search', productController.getProductsBySearch);

productRouter.get('/filter', productController.getProductsByFilter);

productRouter.get('/:id', productController.getProduct);

productRouter.put('/review', auth, productController.productReview);

productRouter.delete('/review', auth, productController.deleteReview);

productRouter.post('/admin', auth, authAdmin, productController.createProduct);

productRouter.put('/admin/:id', auth, authAdmin, productController.updateProduct);

productRouter.delete('/admin/:id', auth, authAdmin, productController.deleteProduct);

productRouter.get('/admin/products', auth, authAdmin, productController.getAdminProducts);