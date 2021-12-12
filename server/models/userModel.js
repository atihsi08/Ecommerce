import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minlength: [4, 'Name should have atleast 4 characters'],
        maxlength: [30, 'Name should not exceed 30 characters'],
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter your email address'],
        validate: [validator.isEmail, 'Please enter valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [8, 'Password should be at least 8 characters'],
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

export const Users = mongoose.model('User', userSchema);