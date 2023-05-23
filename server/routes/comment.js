import express from "express";
import * as controllers from "../controllers/comment.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { checkIsCommentFromVisibleForumMdwFn, checkIsCommentOwner, FORUM_ID_FROM_BODY_EXTRACTOR, FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR } from "../middlewares/comment.js";
import { findByIdMdwFn } from "../middlewares/findById.js";
import { Comment } from "../models/comment.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const commentsRouter = express.Router();

commentsRouter.post("/", authorizeMdw, checkIsCommentFromVisibleForumMdwFn(FORUM_ID_FROM_BODY_EXTRACTOR), controllers.createComment );

commentsRouter.get("/:id", authorizeMdw, findByIdMdwFn({ model: Comment }), checkIsCommentFromVisibleForumMdwFn(FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR), controllers.getCommentById);
commentsRouter.put("/:id", authorizeMdw, findByIdMdwFn({ model: Comment, forbiddenChecker: checkIsCommentOwner}), checkIsCommentFromVisibleForumMdwFn(FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR), controllers.updateComment);
commentsRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: Comment, forbiddenChecker: checkIsCommentOwner }), checkIsCommentFromVisibleForumMdwFn(FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR), controllers.deleteComment);

commentsRouter.put("/:id/interact", authorizeMdw, findByIdMdwFn({ model: Comment }), checkIsCommentFromVisibleForumMdwFn(FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR), controllers.interactWithComment);

const controllerName = "comments";
export const commentsSwaggerPaths = {
  [`/${controllerName}/`]: {
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