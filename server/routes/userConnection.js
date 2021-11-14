import express from "express";
import * as controllers from "../controllers/userConnection.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const userConnectionsRouter = express.Router();

const reqToUserIds = autoTransformToUserIdsMdwFn([
  (req) => req.body,
  "toUserId",
]);

userConnectionsRouter.post("/follow", authorizeMdw, reqToUserIds, controllers.follow);
userConnectionsRouter.post("/block", authorizeMdw, reqToUserIds, controllers.block);
userConnectionsRouter.delete("/unfollow", authorizeMdw, reqToUserIds, controllers.unfollow);
userConnectionsRouter.delete("/unblock", authorizeMdw, reqToUserIds, controllers.unblock);

const controllerName = "user-connections";
export const userConnectionsSwaggerPaths = {
  [`/${controllerName}/follow`]: {
    post: createSwaggerPath(
      "Follow a user and remove old connection to this user if it exists.",
      [controllerName, "users"],
      null,
      SwaggerTypes.object({
        toUserId: SwaggerTypes.ref("UserIdentifier"),
      }),
      SwaggerTypes.ref("UserConnection"),
    )
  },

  [`/${controllerName}/block`]: {
    post: createSwaggerPath(
      "Block a user and remove old connection to this user if it exists.",
      [controllerName, "users"],
      null,
      SwaggerTypes.object({
        toUserId: SwaggerTypes.ref("UserIdentifier"),
      }),
      SwaggerTypes.ref("UserConnection"),
    )
  },

  [`/${controllerName}/unfollow`]: {
    delete: createSwaggerPath(
      "Unfollow a user if there is a 'follow' connection to them.",
      [controllerName, "users"],
      null,
      SwaggerTypes.object({
        toUserId: SwaggerTypes.ref("UserIdentifier"),
      }),
    )
  },

  [`/${controllerName}/unblock`]: {
    delete: createSwaggerPath(
      "Unblock a user if there is a 'block' connection to them.",
      [controllerName, "users"],
      null,
      SwaggerTypes.object({
        toUserId: SwaggerTypes.ref("UserIdentifier"),
      }),
    )
  },
}
