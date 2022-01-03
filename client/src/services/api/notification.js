import { apiService } from "./index";

export const fetchNotifications = () => apiService.get("/api/notifications");
export const setNotificationSeenState = (notiId, newValue) => apiService.put(`api/notifications/${notiId}/set-seen-state?value=${newValue}`)

export const setAllNotificationsAsSeen = () => apiService.put(`api/notifications/mark-all-as-seen`);

export const clearAllSeenNotifications = () => apiService.delete(`api/notifications/seen`);
export const deleteNotification = (notiId) => apiService.delete(`api/notifications/${notiId}`);