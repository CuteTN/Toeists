import { apiService } from "./index";

export const getUserById = (id) => apiService.get(`api/users/${id}`);