import express from "express";
import * as controller from "../controllers/users.js";
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const usersRouter = express.Router();

const reqParamsToUserId = autoTransformToUserIdsMdwFn([
  (req) => req.params,
  "id",
]);

usersRouter.get("/", controller.getAllUsers);
usersRouter.get("/:id", reqParamsToUserId, controller.getUserById);
usersRouter.get(
  "/:id/connections",
  reqParamsToUserId,
  controller.getUserConnections
);
usersRouter.put("/:id", authorizeMdw, reqParamsToUserId, controller.updateUser);

const controllerName = "users";
export const usersSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all users.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("User")),
    )
  },

  [`/${controllerName}/{id}`]: {
    get: createSwaggerPath(
      "Get a user by ID (or username or email).",
      [controllerName],
      [
        {
          name: "id",
          in: "path",
          required: true,
          schema: SwaggerTypes.ref("UserIdentifier"),
        }
      ],
      null,
      SwaggerTypes.ref("User"),
    ),

    put: createSwaggerPath(
      "Update a user by ID (or username or email).",
      [controllerName],
      [
        {
          name: "id",
          in: "path",
          required: true,
          schema: SwaggerTypes.ref("UserIdentifier"),
        }
      ],
      SwaggerTypes.ref("User"),
      SwaggerTypes.ref("User"),
    ),
  },

  [`/${controllerName}/{id}/connections`]: {
    get: createSwaggerPath(
      "Get all connections from/to a user.",
      [controllerName, "user-connections"],
      [
        {
          name: "id",
          in: "path",
          required: true,
          schema: SwaggerTypes.ref("UserIdentifier"),
        }
      ],
      null,
      SwaggerTypes.ref("ConnectionsOfAUser"),
    )
  },
}