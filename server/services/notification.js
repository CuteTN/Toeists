import Notification from "../models/notification.js";
import { cuteIO } from "../index.js";

/**
 * Add a new notification to Database, then send it to user
 * @param {{ receiverId, title, text, url, kind, isSeen }} notification
 */
export const sendNotificationToUser = async (notification) => {
  const { userId, kind } = notification;
  const notificationDoc = new Notification(notification);
  await notificationDoc.save();
  cuteIO.sendToUser(userId, "Notification-" + kind, notificationDoc);
};