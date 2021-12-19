import { apiService } from "./index";

export const fetchHashtag = () => apiService.get("/api/hashtags");
