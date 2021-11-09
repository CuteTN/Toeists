import { apiService } from "./index";

export const getUserById = (id) => apiService.get(`api/users/${id}`);

export const SIGN_IN_ROUTE = '/api/users/sign-in'
export const REFRESH_TOKEN_ROUTE = '/api/users/refresh-token'

export const signIn = (identifier, password) =>
  apiService.post(SIGN_IN_ROUTE, { identifier, password });

export const signUp = (userData) =>
  apiService.post('/api/users/', userData);

export const refreshToken = (refreshToken) =>
  apiService.post('/api/users/refresh-token', { refreshToken });

export const invalidateRefreshToken = (refreshToken) =>
  apiService.delete('/api/users/invalidate-refresh-token', { data: { refreshToken } });