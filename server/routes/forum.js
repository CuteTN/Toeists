import express from "express";
import * as controllers from "../controllers/forum.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { findByIdMdwFn } from "../middlewares/findById.js";
import { Forum } from "../models/forum.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const forumsRouter = express.Router();

const checkIsForumOwner = (forum, req) => {
  if (!forum.creatorId.equals(req.attached?.decodedToken?.userId))
    return "Only the forum's creator can access this data."
}

forumsRouter.get("/", controllers.getForums);
forumsRouter.post("/", authorizeMdw, controllers.createForum );

forumsRouter.get("/:id", authorizeMdw, findByIdMdwFn({ model: Forum }), controllers.getForumById);
forumsRouter.put("/:id", authorizeMdw, findByIdMdwFn({ model: Forum, forbiddenChecker: checkIsForumOwner }), controllers.updateForum);
forumsRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: Forum, forbiddenChecker: checkIsForumOwner }), controllers.deleteForum);

forumsRouter.put("/:id/interact", authorizeMdw, findByIdMdwFn({ model: Forum }), controllers.interactWithForum);

const controllerName = "forums";
export const forumsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all the forums that is visible to the current user.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("Forum")),
    ),

    post: createSwaggerPath(
      "Create a new forum.",
      [controllerName],
      null,
      SwaggerTypes.ref("Forum"),
      SwaggerTypes.ref("Forum"),
    )
  },

  [`/${controllerName}/{id}`]: {
    get: createSwaggerPath(
      "Get a forum by its ID.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.ref("Forum"),
    ),

    put: createSwaggerPath(
      "Update a forum. This API only allows you to update content and title of a forum.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.ref("Forum"),
      SwaggerTypes.ref("Forum"),
    ),

    delete: createSwaggerPath(
      "Delete a forum. Cascade delete all its comments and interaction information.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      null
    ),
  },

  [`/${controllerName}/{id}/interact`]: {
    put: createSwaggerPath(
      "Get a forum by its ID.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        },
        {
          name: "type",
          in: "query",
          schema: SwaggerTypes.ref("InteractionInfoTypes"),
        }
      ],
      null,
      SwaggerTypes.ref("Forum"),
    ),
  }
}