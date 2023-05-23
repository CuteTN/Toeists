import { apiService } from "./index";

export const getAllUsers = () => apiService.get("api/users")
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

export const getUserConnections = (id) =>
  apiService.get(`api/users/${id}/connections`);

export const updateUser = (id, updatedInfo) =>
  apiService.put(`api/users/${id}`, updatedInfo);

export const requestAccountActivation = (id) =>
  apiService.get(`api/users/${id}/activate-account`);

export const activateAccount = (id, activateAccountToken) =>
  apiService.put(`api/users/${id}/activate-account`, { activateAccountToken });

export const resetPassword = (id, { newPassword, currentPassword, resetPasswordToken }) =>
  apiService.put(`api/users/${id}/reset-password`, { newPassword, currentPassword, resetPasswordToken });
