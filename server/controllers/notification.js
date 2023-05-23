import express from 'express'
import { Notification } from '../models/notification.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { cuteIO } from '../index.js'

/**
 * @param {*} userId 
 * @returns Notify to a user that their list of notifications has been updated
 */
const notifyNotificationsUpdate = (userId) =>
  cuteIO.sendToUser(userId.toString(), "System-NotificationsUpdate");


/** @type {express.RequestHandler} */
export const getAllNotifications = async (req, res, next) => {
  const receiverId = req.attached.decodedToken.userId;
  const notifications = await Notification.find({ receiverId }).sort({ createdAt: "desc" });
  return res.status(httpStatusCodes.ok).json(notifications);
}


/** @type {express.RequestHandler} */
export const setNotificationSeenState = async (req, res, next) => {
  let newSeenState = null;
  switch (req.query.value.toLowerCase?.()) {
    case "true": newSeenState = true; break;
    case "false": newSeenState = false; break;
    default: return res.status(httpStatusCodes.badRequest).json({ message: "The value query param can only take 'true' or 'false'" });
  }

  const notification = req.attached.targetedData;
  try {
    if (notification.isSeen !== newSeenState) {
      notification.isSeen = newSeenState;
      await notification.save();
      notifyNotificationsUpdate(notification.receiverId);
    }

    return res.status(httpStatusCodes.ok).json(notification);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while updating the notification.", error });
  }
}


/** @type {express.RequestHandler} */
export const setAllNotificationsAsSeen = async (req, res, next) => {
  const receiverId = req.attached.decodedToken.userId;
  const notificationsToUpdate = await Notification.find({ receiverId, isSeen: false });
  notificationsToUpdate.forEach(noti => noti.isSeen = true);

  await Notification.bulkSave(notificationsToUpdate);
  notifyNotificationsUpdate(receiverId);
  return res.sendStatus(httpStatusCodes.ok);
}


/** @type {express.RequestHandler} */
export const deleteSeenNotifications = async (req, res, next) => {
  const receiverId = req.attached.decodedToken.userId;
  await Notification.deleteMany({ receiverId, isSeen: true });

  notifyNotificationsUpdate(receiverId);
  return res.sendStatus(httpStatusCodes.ok);
}


/** @type {express.RequestHandler} */
export const deleteNotification = async (req, res, next) => {
  const receiverId = req.attached.decodedToken.userId;
  const notification = req.attached.targetedData;
  await Notification.findByIdAndDelete(notification._id);

  notifyNotificationsUpdate(receiverId);
  return res.sendStatus(httpStatusCodes.ok);
}