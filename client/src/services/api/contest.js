import { apiService } from "./index";

export const createContestPart = (contestPart) => apiService.post("/api/contest-parts", contestPart);