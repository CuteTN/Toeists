import { apiService } from "./index";
import { convertToQueryString } from "../../utils/apiHelpers";

export const createContestPart = (contestPart) =>
  apiService.post("/api/contest-parts", contestPart);
export const fetchAContest = (contestID) =>
  apiService.get(`api/contest-parts/${contestID}`);
export const deleteContest = (contestID) =>
  apiService.delete(`api/contest-parts/${contestID}`);
export const fetchAllContests = () => apiService.get(`api/contest-parts?`);
export const submitToAContest = (contestID, answers) => apiService.post(`api/contest-parts/${contestID}/submit`, { answers })
