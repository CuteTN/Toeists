import { apiService } from "./index";

export const requestReloadBrowser = (browserId) => apiService.post("/system/reload-browser", { browserId });