import express from "express";
import * as controllers from "../controllers/notification.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import { authorizeMdw } from '../middlewares/authorization.js'
import { findByIdMdwFn } from "../middlewares/findById.js";
import { Notification } from "../models/notification.js";

export const notificationsRouter = express.Router();

const checkIsForumOwner = (notification, req) => {
  if (!notification.receiverId.equals(req.attached?.decodedToken?.userId))
    return "Only the notification's receiver can access this data."
}

notificationsRouter.get("/", authorizeMdw, controllers.getAllNotifications);
notificationsRouter.put("/mark-all-as-seen", authorizeMdw, controllers.setAllNotificationsAsSeen);
notificationsRouter.put("/:id/set-seen-state", authorizeMdw, findByIdMdwFn({ model: Notification, forbiddenChecker: checkIsForumOwner }), controllers.setNotificationSeenState);
notificationsRouter.delete("/seen", authorizeMdw, controllers.deleteSeenNotifications);
notificationsRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: Notification, forbiddenChecker: checkIsForumOwner }), controllers.deleteNotification);

const controllerName = "notifications";
export const notificationsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all notifications of the current user.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("Notification")),
    )
  },

  [`/${controllerName}/mark-all-as-seen`]: {
    put: createSwaggerPath(
      "Mark all notifications of the current user as seen.",
      [controllerName],
      null,
      null,
      null,
    )
  },

  [`/${controllerName}/{id}/set-seen-state`]: {
    put: createSwaggerPath(
      "Mark a notification as seen/unseen.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        },
        {
          name: "value",
          in: "query",
          required: true,
          schema: SwaggerTypes.boolean(),
        }
      ],
      null,
      SwaggerTypes.ref("Notification"),
    )
  },

  [`/${controllerName}/seen`]: {
    delete: createSwaggerPath(
      "Clear all seen notifications of the current user.",
      [controllerName],
      null,
      null,
      null,
    )
  },

  [`/${controllerName}/{id}`]: {
    delete: createSwaggerPath(
      "Remove a notification.",
      [controllerName],
      null,
      null,
      null,
    )
  },
}