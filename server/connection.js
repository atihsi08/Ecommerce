import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGODB_URL;

export const connection = () => {
    try {
        mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) console.log(err);
            else console.log("Database connected successfully!");
        })
    } catch (error) {
        console.log(error);
    }
}