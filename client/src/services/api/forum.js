import { apiService } from "./index";

export const createForum = (forum) => apiService.post("/api/forums", forum);
export const fetchAPost = (forumID) => apiService.get(`api/forums/${forumID}`);
export const deleteForum = (forumID) =>
  apiService.delete(`api/forums/${forumID}`);
export const updateForum = (forumID, newForum) =>
  apiService.put(`api/forums/${forumID}`, newForum);

/** 
 * @param {"upvote"|"downvote"|"unvote"|"follow"|"unfollow"} type
 */
export const interactWithForum = (forumId, type) => apiService.put(`api/forums/${forumId}/interact?type=${type}`);