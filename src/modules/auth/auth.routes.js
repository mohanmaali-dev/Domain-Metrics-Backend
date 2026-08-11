import { Router } from 'express';

import * as authController from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh', authController.refresh);
authRouter.get('/me', authController.getCurrentUser);
authRouter.patch('/change-password', authController.changePassword);
