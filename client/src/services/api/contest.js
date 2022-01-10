import { apiService } from "./index";

export const createContestPart = (contestPart) =>
  apiService.post("/api/contest-parts", contestPart);
export const fetchAContest = (contestID) =>
  apiService.get(`api/contest-parts/${contestID}`);
