import { apiService } from "./index";

export const createForum = (forum) => apiService.post("/api/forums", forum);
