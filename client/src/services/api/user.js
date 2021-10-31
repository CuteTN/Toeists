import { apiService } from "./index";

export const getUserById = (id) => apiService.get(`api/users/${id}`);
export const getUserConnections = (id) =>
  apiService.get(`api/users/${id}/connections`);
export const updateUser = (id, updatedInfo) =>
  apiService.put(`api/users/${id}`, updatedInfo);
