import { accessCookieOptions, refreshCookieOptions } from '../../config/cookies.js';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './auth.constants.js';
import * as authService from './auth.service.js';

const setAuthCookies = (response, accessToken, refreshToken) => {
  response.cookie(ACCESS_COOKIE, accessToken, accessCookieOptions);
  response.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
};

export const register = async (request, response) => {
  const result = await authService.register(request.body);
  setAuthCookies(response, result.accessToken, result.refreshToken);

  return response.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result.user,
  });
};

export const login = async (request, response) => {
  const result = await authService.login(request.body);
  setAuthCookies(response, result.accessToken, result.refreshToken);

  return response.status(200).json({
    success: true,
    message: 'Login successful',
    data: result.user,
  });
};

export const logout = async (request, response) => {
  await authService.logout(request.cookies[REFRESH_COOKIE]);
  response.clearCookie(ACCESS_COOKIE, accessCookieOptions);
  response.clearCookie(REFRESH_COOKIE, refreshCookieOptions);

  return response.status(200).json({ success: true, message: 'Logout successful' });
};

export const refresh = async (request, response) => {
  const tokens = await authService.refresh(request.cookies[REFRESH_COOKIE]);
  setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

  return response.status(200).json({ success: true, message: 'Token refreshed' });
};

export const getCurrentUser = async (request, response) => {
  const user = await authService.getCurrentUser(request.userId);
  return response.status(200).json({ success: true, message: 'User fetched', data: user });
};

export const changePassword = async (request, response) => {
  const { currentPassword, newPassword } = request.body;
  await authService.changePassword(request.userId, currentPassword, newPassword);
  response.clearCookie(ACCESS_COOKIE, accessCookieOptions);
  response.clearCookie(REFRESH_COOKIE, refreshCookieOptions);

  return response.status(200).json({
    success: true,
    message: 'Password changed. Please log in again.',
  });
};
