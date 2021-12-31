import { Notification } from "../../models/notification.js";
import { cuteIO } from "../../index.js";

/**
 * Add a new notification to Database, then send it to user
 * @param {{ receiverId, title, text, url, kind, isSeen }} notification
 */
export const sendNotificationToUser = async (notification) => {
  try {
    const { receiverId, kind } = notification;
    const notificationDoc = await Notification.create(notification);
    cuteIO.sendToUser(receiverId, "Notification-" + kind, notificationDoc);
  }
  catch(error) { console.error("Notification error: ", error); }
};