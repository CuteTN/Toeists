import { apiService } from "./index";

export const fetchNotifications = () => apiService.get("/api/notifications");
