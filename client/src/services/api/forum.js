import { apiService } from "./index";

export const createForum = (forum) => apiService.post("/api/forums", forum);
export const fetchAPost = (forumID) => apiService.get(`api/forums/${forumID}`);
