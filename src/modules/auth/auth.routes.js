import { Router } from 'express';

import { emailRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import * as authController from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh', authController.refresh);
authRouter.get('/me', authController.getCurrentUser);
authRouter.patch('/change-password', authController.changePassword);
authRouter.post('/forgot-password', emailRateLimiter, authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/send-verification', emailRateLimiter, authController.sendVerificationEmail);
authRouter.post('/verify-email', authController.verifyEmail);
