import { apiService } from "./index";

export const createComment = (comment) =>
  apiService.post("/api/comments", comment);
