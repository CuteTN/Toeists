import express from "express";
import * as controllers from "../controllers/conversation.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { checkConversationTypeMdwFn, checkIsMemberOfConversationMdwFn } from "../middlewares/conversation.js"
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";
import { Conversation } from "../models/conversation.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import { findByIdMdwFn, TARGETED_DATA_EXTRACTOR } from "../middlewares/findById.js";

export const conversationsRouter = express.Router();

conversationsRouter.get("/", authorizeMdw, controllers.getConversationsOfUser);
conversationsRouter.post("/",
  autoTransformToUserIdsMdwFn([req => req.body, "memberIds"]),
  authorizeMdw,
  controllers.createConversation
);

conversationsRouter.get("/private/:partnerId",
  authorizeMdw,
  autoTransformToUserIdsMdwFn([req => req.params, "partnerId"]),
  controllers.getPrivateConversationByPartnerId,
)

conversationsRouter.get("/:id",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkIsMemberOfConversationMdwFn(),
  controllers.getConversationById,
)

conversationsRouter.put("/:id",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkIsMemberOfConversationMdwFn(TARGETED_DATA_EXTRACTOR, true),
  controllers.updateConversation,
)

conversationsRouter.delete("/:id",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkConversationTypeMdwFn("group"),
  checkIsMemberOfConversationMdwFn(TARGETED_DATA_EXTRACTOR, true),
  controllers.removeGroupConversation,
)

conversationsRouter.post("/:id/members",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkConversationTypeMdwFn("group"),
  checkIsMemberOfConversationMdwFn(TARGETED_DATA_EXTRACTOR, true),
  autoTransformToUserIdsMdwFn([req => req.body, "memberIds"]),
  controllers.upsertMembersToGroupConversation
)

conversationsRouter.delete("/:id/members",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkConversationTypeMdwFn("group"),
  checkIsMemberOfConversationMdwFn(TARGETED_DATA_EXTRACTOR, true),
  autoTransformToUserIdsMdwFn([req => req.body, "memberIds"]),
  controllers.removeMembersFromGroupConversation
)

conversationsRouter.put("/:id/member-roles",
  authorizeMdw,
  findByIdMdwFn({ model: Conversation }),
  checkConversationTypeMdwFn("group"),
  checkIsMemberOfConversationMdwFn(TARGETED_DATA_EXTRACTOR, true),
  controllers.setMemberRolesOfGroupConversation
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

    put: createSwaggerPath(
      "Update conversation information. Only group's admins can perform this action. This does NOT update conversation members and type.",
      [controllerName],
      [
        {
          in: "path",
          name: "id",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.ref("Conversation"),
      SwaggerTypes.ref("Conversation"),
    ),

    delete: createSwaggerPath(
      "Remove a group conversation. Only admins can perform this action.",
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
      null
    )
  },

  [`/${controllerName}/{id}/members`]: {
    post: createSwaggerPath(
      "Upsert members to a group conversation. Only admins can perform this action.",
      [controllerName],
      [
        {
          in: "path",
          name: "id",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.object({
        memberIds: SwaggerTypes.array(SwaggerTypes.ref("UserIdentifier"))
      }),
      SwaggerTypes.ref("Conversation"),
    ),

    delete: createSwaggerPath(
      "Remove members from a group conversation. Only admins can perform this action.",
      [controllerName],
      [
        {
          in: "path",
          name: "id",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.object({
        memberIds: SwaggerTypes.array(SwaggerTypes.ref("UserIdentifier"))
      }),
      SwaggerTypes.ref("Conversation"),
    ),
  },

  [`/${controllerName}/{id}/member-roles`]: {
    put: createSwaggerPath(
      "Set members' roles in group conversation. Only admins can perform this action.",
      [controllerName],
      [
        {
          in: "path",
          name: "id",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.object({
        members: SwaggerTypes.array(SwaggerTypes.object({
          memberId: SwaggerTypes.ref("UserIdentifier"),
          role: SwaggerTypes.enum(["admin", "none"], { example: "none" })
        }))
      }),
      SwaggerTypes.ref("Conversation"),
    ),
  },

  [`/${controllerName}/private/{partnerId}`]: {
    get: createSwaggerPath(
      "Retrieve or create a private conversation with another user.",
      [controllerName],
      [
        {
          name: "partnerId",
          in: "path",
          required: true,
          schema: SwaggerTypes.ref("UserIdentifier"),
        },
        {
          name: "auto-create",
          in: "query",
          description: "When enabled, a new private conversation would be created if it doesn't exist.",
          schema: SwaggerTypes.boolean(),
        }
      ],
      null,
      SwaggerTypes.ref("Conversation"),
    )
  }
}