import express from 'express';
import { userController } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { authAdmin } from '../middlewares/authAdmin.js';

export const userRouter = express.Router();

userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

userRouter.get('/logout', userController.logout);

userRouter.get('/admin/user/:id', auth, authAdmin, userController.getSingleUser);

userRouter.post('/password/forgot', userController.forgotPassword);

userRouter.put('/password/reset/:token', userController.resetPassword);

userRouter.get('/profile', auth, userController.getUserDetails);

userRouter.put('/password/update', auth, userController.updatePassword);

userRouter.put('/profile/update', auth, userController.updateProfile);

userRouter.get('/admin/users', auth, authAdmin, userController.getUsers);


userRouter.put('/admin/profile/update/:id', auth, authAdmin, userController.updateUserProfile);

userRouter.delete('/admin/delete/:id', auth, authAdmin, userController.deleteUser);