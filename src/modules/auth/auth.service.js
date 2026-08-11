import jwt from 'jsonwebtoken';

import { comparePassword, hashPassword } from '../../utils/password.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { hashToken } from '../../utils/token.js';
import { User } from '../users/user.model.js';
import { createUser } from '../users/user.service.js';
import { AuthToken } from './auth-token.model.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const saveRefreshToken = async (userId, refreshToken) => {
  const decoded = jwt.decode(refreshToken);

  await AuthToken.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
  });
};

const issueTokens = async (userId) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);
  await saveRefreshToken(userId, refreshToken);
  return { accessToken, refreshToken };
};

export const register = async (data) => {
  const user = await createUser(data);
  const tokens = await issueTokens(user.id);
  return { user, ...tokens };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await comparePassword(password, user.password))) {
    throw createError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw createError('User account is inactive', 403);
  }

  const tokens = await issueTokens(user.id);
  user.password = undefined;
  return { user, ...tokens };
};

export const logout = async (refreshToken) => {
  if (refreshToken) {
    await AuthToken.deleteOne({ tokenHash: hashToken(refreshToken) });
  }
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw createError('Refresh token is required', 401);
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw createError('Invalid or expired refresh token', 401);
  }

  const storedToken = await AuthToken.findOneAndDelete({ tokenHash: hashToken(refreshToken) });
  const user = await User.findById(payload.userId);

  if (!storedToken || !user || !user.isActive) {
    throw createError('Refresh token is not valid', 401);
  }

  return issueTokens(user.id);
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError('User not found', 404);
  }

  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw createError('Current password is incorrect', 400);
  }

  user.password = await hashPassword(newPassword);
  await user.save();
  await AuthToken.deleteMany({ user: userId });
};
