import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connection } from './connection.js';
import { productRouter } from './routes/productRouter.js';
import { userRouter } from './routes/userRouter.js';
import { orderRouter } from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { paymentRouter } from './routes/paymentRoutes.js';

const app = express();
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use(express.static(path.join(__dirname, '../client/build')));

connection();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    res.send("Ecommerce");
})

app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
})