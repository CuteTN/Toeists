import { apiService } from "./index";

export const createComment = (comment) =>
  apiService.post("/api/comments", comment);
export const deleteComment = (commentId) =>
  apiService.delete(`api/comments/${commentId}`);
export const updateComment = (commentId, comment) =>
  apiService.put(`api/comments/${commentId}`, comment);

/** 
 * @param {"upvote"|"downvote"|"unvote"|"follow"|"unfollow"} type
 */
 export const interactWithComment = (commentId, type) => apiService.put(`api/comments/${commentId}/interact?type=${type}`);
