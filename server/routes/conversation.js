import express from "express";
import * as controllers from "../controllers/conversation.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { checkIsMemberOfConversationMdwFn } from "../middlewares/conversation.js"
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";
import { Conversation } from "../models/conversation.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import { findByIdMdwFn } from "../middlewares/findById.js";

export const conversationsRouter = express.Router();

conversationsRouter.get("/", authorizeMdw, controllers.getConversationsOfUser);
conversationsRouter.post("/",
  autoTransformToUserIdsMdwFn([req => req.body, "memberIds"]),
  authorizeMdw,
  controllers.createConversation
);

conversationsRouter.get("/:id",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkIsMemberOfConversationMdwFn(),
  controllers.getConversationById,
)

const controllerName = "conversations";
export const conversationsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all conversations of the current user.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("Conversation")),
    ),

    post: createSwaggerPath(
      "Create a new conversation.",
      [controllerName],
      null,
      SwaggerTypes.ref("Conversation"),
      SwaggerTypes.ref("Conversation"),
      )
    },
    
    [`/${controllerName}/{id}`]: {
      get: createSwaggerPath(
        "Get a conversation of the current user by its ID.",
        [controllerName],
        [
          {
            in: "path",
            name: "id",
            required: true,
            schema: SwaggerTypes.string(),
          }
        ],
        null,
        SwaggerTypes.ref("Conversation"),
    ),
  }
}