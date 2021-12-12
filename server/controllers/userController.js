import { Users } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const userController = {
    register: async (req, res) => {
        try {
            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });

            const { name, email, password } = req.body;
            console.log(name + " " + email + " " + password)

            const user = await Users.findOne({ email });
            console.log("After" + user)

            if (user) return res.status(400).json({ success: false, message: 'User already exists' });
            console.log("Msg" + user)
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword)
            const newUser = await Users.create({
                name,
                email,
                password: hashedPassword,
                avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            });
            console.log(newUser)
            const token = createToken(newUser._id);
            console.log(token);
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000)
            })
            console.log(newUser);
            res.status(200).json({
                success: true,
                user: newUser,
                token
            })
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) return res.status(401).json({ message: 'Invalid Credentials' });

            const token = createToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            });

            res.status(200).json({ success: true, user, token });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    logout: async (req, res) => {
        try {
            res.cookie("token", null, {
                httpOnly: true,
                expires: new Date(Date.now()),
            });

            res.status(200).json({ message: "Logged out successfully." });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    forgotPassword: async (req, res) => {
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");
        const resetPasswordExpires = Date.now() + 15 * 60 * 1000;

        const { email } = req.body;
        const user = await Users.findOne({ email });
        try {

            if (!user) res.status(404).json({ message: 'User not found!!' });

            user.resetPasswordExpires = resetPasswordExpires;
            user.resetPasswordToken = resetPasswordToken;

            await user.save();

            const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

            const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`

            await sendEmail({
                email,
                subject: "Reset password",
                message
            });

            res.status(200).json({ success: true, message: `Link to reset password has been sent to ${email} successfully.` });
        } catch (error) {
            user.resetPasswordExpires = undefined;
            user.resetPasswordToken = undefined;

            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: error });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

            const user = await Users.findOne({
                resetPasswordToken,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            res.status(200).json({ success: true, message: 'Password changed successfully. Please login to your account.' });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    getUserDetails: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await Users.findById(userId).select('-password');
            res.status(200).json({
                success: true,
                user
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            const isPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!isPasswordMatch) return res.json({ message: 'Incorrect old password' });
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
            await user.updateOne({ password: hashedPassword });

            const token = createToken(user._id);

            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            });

            res.status(200).json({ success: true, message: 'Password Updated Successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const newUserData = {
                name: req.body.name,
                email: req.body.email,
                avatar: {
                    public_id: '',
                    url: ''
                }
            };
            const user = await Users.findById(req.user.id);
            newUserData.avatar = {
                public_id: user?.avatar?.public_id,
                url: user?.avatar?.url
            }

            if (req.body.avatar !== "") {
                const imageId = user.avatar.public_id;

                await cloudinary.v2.uploader.destroy(imageId);

                const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                    folder: "avatars",
                    width: 150,
                    crop: "scale",
                });

                newUserData.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }

            await Users.findByIdAndUpdate(req.user.id, newUserData, { new: true });
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await Users.find();

            res.status(200).json({ success: true, users });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    getSingleUser: async (req, res) => {
        try {
            const userId = mongoose.Types.ObjectId(req.params.id);
            const user = await Users.findById(userId);
            console.log(userId);
            if (!user) return res.status(404).json({ message: `User does not exist with id: ${req.params.id}` });
            console.log(user);

            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    updateUserProfile: async (req, res) => {
        try {
            const newUserData = {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
            }

            const userId = mongoose.Types.ObjectId(req.params.id);
            const user = await Users.findById(userId);

            if (!user) return res.status(404).json({ message: `User with id ${req.params.id} not found` });

            await Users.findByIdAndUpdate(userId, newUserData);
            res.status(200).json({ success: true, user });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);

            if (!user) return res.status(404).json({ message: `User with id ${req.params.id} not found` });

            const imageId = user.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);

            await user.remove();

            res.status(200).json({ success: true, message: 'User deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    },
}

const createToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
}

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        const mailOptions = {
            from: process.env.USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOptions);

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
}