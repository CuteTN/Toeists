import { apiService } from './index';

export const SIGN_IN_ROUTE = '/api/authentication/signin'
export const REFRESH_TOKEN_ROUTE = '/api/authentication/refresh-token'

export const signIn = (identifier, password) =>
  apiService.post(SIGN_IN_ROUTE, { identifier, password });

export const signUp = (userData) =>
  apiService.post('/api/authentication/signup', userData);

export const refreshToken = (refreshToken) =>
  apiService.post('/api/authentication/refresh-token', { refreshToken });

export const invalidateRefreshToken = (refreshToken) =>
  apiService.delete('/api/authentication/invalidate', { data: { refreshToken } });