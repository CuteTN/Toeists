import express from "express";
import * as controllers from "../controllers/users.js";
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const usersRouter = express.Router();

const reqParamsToUserId = autoTransformToUserIdsMdwFn([
  (req) => req.params,
  "id",
]);

usersRouter.get("/", controllers.getAllUsers);
usersRouter.post("/", controllers.createUser);

usersRouter.post("/sign-in", controllers.signIn);

usersRouter.post("/refresh-token", controllers.refreshToken);

usersRouter.delete("/invalidate-refresh-token", controllers.invalidateRefreshToken);

usersRouter.get("/:id", reqParamsToUserId, controllers.getUserById);
usersRouter.put("/:id", authorizeMdw, reqParamsToUserId, controllers.updateUser);

usersRouter.get( "/:id/connections", reqParamsToUserId, controllers.getUserConnections );



const controllerName = "users";
export const usersSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all users.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("User")),
    ),

    post: createSwaggerPath(
      "Register a new user.",
      [controllerName],
      null,
      SwaggerTypes.ref("User"),
      SwaggerTypes.ref("User"),
    )
  },

  [`/${controllerName}/sign-in`]: {
    post: createSwaggerPath(
      "Sign user in. Response an access token and a refresh token by default",
      [controllerName],
      [
        {
          name: "no-refresh",
          in: "query",
          schema: SwaggerTypes.boolean({
            description: "Disable refresh token.",
            example: true
          })
        }
      ],
      SwaggerTypes.object({
        identifier: SwaggerTypes.ref("UserIdentifier"),
        password: SwaggerTypes.ref("UserPassword"),
      }),
      SwaggerTypes.object({
        accessToken: SwaggerTypes.string(),
        refreshToken: SwaggerTypes.string({ nullable: true }),
        username: SwaggerTypes.string(),
        userId: SwaggerTypes.string(),
      })
    )
  },

  [`/${controllerName}/refresh-token`]: {
    post: createSwaggerPath(
      "Get new access token and invalidate the supplied refresh token.",
      [controllerName],
      null,
      SwaggerTypes.object({
        refreshToken: SwaggerTypes.string(),
      }),
      SwaggerTypes.object({
        accessToken: SwaggerTypes.string(),
        refreshToken: SwaggerTypes.string(),
      })
    )
  },

  [`/${controllerName}/invalidate-refresh-token`]: {
    delete: createSwaggerPath(
      "Invalidate the supplied refresh token. This should be used when a user signs out.",
      [controllerName],
      null,
      SwaggerTypes.object({
        refreshToken: SwaggerTypes.string(),
      }),
      SwaggerTypes.object({
        accessToken: SwaggerTypes.string(),
        refreshToken: SwaggerTypes.string(),
      })
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
      "Update a user by ID (or username or email). This API does **NOT** update password, email and username. Only logged in user can edit their own data.",
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