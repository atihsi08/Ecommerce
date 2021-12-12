import jwt from 'jsonwebtoken';
import { Users } from '../models/userModel.js';

export const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Please Login' });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) return res.json({ message: err.message });
        return data;
    });

    req.user = await Users.findById(decodedData.id);

    next();
}