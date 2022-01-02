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
notificationsRouter.put("/:id/set-seen-state", authorizeMdw, findByIdMdwFn({ model: Notification, forbiddenChecker: checkIsForumOwner }), controllers.setNotificationSeenState);

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
}