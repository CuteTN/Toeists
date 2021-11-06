import express from "express";
import * as controllers from "../controllers/authentication.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const authenticationRouter = express.Router();

authenticationRouter.post("/signup", controllers.signUp);
authenticationRouter.post("/signin", controllers.signIn);
authenticationRouter.post("/refresh-token", controllers.refreshToken);
authenticationRouter.delete("/invalidate", controllers.invalidateRefreshToken);



const controllerName = "authentication";
export const authenticationSwaggerPaths = {
  [`/${controllerName}/signup`]: {
    post: createSwaggerPath(
      "Register a new user.",
      [controllerName],
      null,
      SwaggerTypes.ref("User"),
      SwaggerTypes.ref("User"),
    )
  },

  [`/${controllerName}/signin`]: {
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

  [`/${controllerName}/invalidate`]: {
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
  }
}