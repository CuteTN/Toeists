import express from 'express'
import { Notification } from '../models/notification.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js'

/** @type {express.RequestHandler} */
export const getAllNotifications = async (req, res, next) => {
  const receiverId = req.attached.decodedToken.userId;
  const notifications = await Notification.find({ receiverId }).sort({ createdAt: "desc" });
  return res.status(httpStatusCodes.ok).json(notifications);
}

/** @type {express.RequestHandler} */
export const setNotificationSeenState = async (req, res, next) => {
  let newSeenState = null; 
  switch(req.query.value.toLowerCase?.()) {
    case "true": newSeenState = true; break;
    case "false": newSeenState = false; break;
    default: return res.status(httpStatusCodes.badRequest).json({ message: "The value query param can only take 'true' or 'false'" });
  }

  const notification = req.attached.targetedData;
  try {
    notification.isSeen = newSeenState;
    await notification.save();
    return res.status(httpStatusCodes.ok).json(notification);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while updating the notification.", error });
  }
}