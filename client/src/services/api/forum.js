import { apiService } from "./index";

export const createForum = (forum) => apiService.post("/api/forums", forum);
export const fetchAPost = (forumID) => apiService.get(`api/forums/${forumID}`);
export const deleteForum = (forumID) =>
  apiService.delete(`api/forums/${forumID}`);
export const updateForum = (forumID, newForum) =>
  apiService.put(`api/forums/${forumID}`, newForum);
export const fetchForums = () => apiService.get(`api/forums`);
