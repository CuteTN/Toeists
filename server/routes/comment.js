import express from "express";
import * as controllers from "../controllers/comment.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { findByIdMdwFn } from "../middlewares/findById.js";
import { Comment } from "../models/comment.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const commentsRouter = express.Router();

const checkIsCommentOwner = (comment, req) => {
  if (!comment.creatorId.equals(req.attached?.decodedToken?.userId))
    return "Only the comment's creator can access this data."
}

commentsRouter.get("/", controllers.getComments);
commentsRouter.post("/", authorizeMdw, controllers.createComment );

commentsRouter.get("/:id", authorizeMdw, findByIdMdwFn({ model: Comment }), controllers.getCommentById);
commentsRouter.put("/:id", authorizeMdw, findByIdMdwFn({ model: Comment, forbiddenChecker: checkIsCommentOwner }), controllers.updateComment);
commentsRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: Comment, forbiddenChecker: checkIsCommentOwner }), controllers.deleteComment);

commentsRouter.put("/:id/interact", authorizeMdw, findByIdMdwFn({ model: Comment }), controllers.interactWithComment);

const controllerName = "comments";
export const commentsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all the comments that is visible to the current user. Optional field **forumId** is supported.",
      [controllerName],
      [
        {
          name: "forumId",
          in: "query",
          description: "Filter only comments from a specific forum",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.array(SwaggerTypes.ref("Comment")),
    ),

    post: createSwaggerPath(
      "Create a new Comment.",
      [controllerName],
      null,
      SwaggerTypes.ref("Comment"),
      SwaggerTypes.ref("Comment"),
    )
  },

  [`/${controllerName}/{id}`]: {
    get: createSwaggerPath(
      "Get a comment by its ID.",
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
      SwaggerTypes.ref("Comment"),
    ),

    put: createSwaggerPath(
      "Update a comment. This API only allows you to update content of a comment.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.ref("Comment"),
      SwaggerTypes.ref("Comment"),
    ),

    delete: createSwaggerPath(
      "Delete a comment. Cascade delete all its comments and interaction information.",
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
      "Get a comment by its ID.",
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
      SwaggerTypes.ref("Comment"),
    ),
  }
}