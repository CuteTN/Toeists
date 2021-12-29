import { SwaggerTypes } from "../utils/swagger.js"
import swaggerJsDoc from 'swagger-jsdoc';
import { authorizationSwaggerPaths } from "./authorization.js";
import { userConnectionsSwaggerPaths } from "./userConnection.js";
import { usersSwaggerPaths } from "./users.js";
import { filesSwaggerPaths } from "./files.js";
import { forumsSwaggerPaths } from "./forum.js";
import { commentsSwaggerPaths } from "./comment.js";
import { certificatesSwaggerPaths } from "./certificate.js";
import { hashtagsSwaggerPaths } from "./hashtag.js";
import { conversationsSwaggerPaths } from "./conversation.js";
import { searchSwaggerPaths } from "./search.js";

const swaggerSchemas = Object.freeze({
  User: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    name: SwaggerTypes.string({ example: "Thy Cute" }),
    username: SwaggerTypes.string({ example: "ThyCute" }),
    email: SwaggerTypes.string({ example: "ThyCute@thy.cute" }),
    phoneNumber: SwaggerTypes.string({ example: "123123123" }),
    password: SwaggerTypes.string({ example: "Test.123", writeOnly: true }),
    hashedPassword: SwaggerTypes.string({ readOnly: true }),
    avatarUrl: SwaggerTypes.string({ example: "https://i.imgur.com/cNzoO9b.png" }),
    description: SwaggerTypes.string(),
    gender: SwaggerTypes.enum(['Male', 'Female', 'Other'], { example: "Female" }),
    birthday: SwaggerTypes.date(),
    hashtagIds: SwaggerTypes.array(SwaggerTypes.string(), { readOnly: true, example: [] }),
    hashtags: SwaggerTypes.array(SwaggerTypes.ref("Hashtag"), { readOnly: true, example: [] }),
    hashtagNames: SwaggerTypes.array(SwaggerTypes.string(), { writeOnly: true, example: ["Toeists", "English"] })
  }),

  UserIdentifier: SwaggerTypes.string({
    description: "User identifier could be either an **ID string**, **username** or **email**",
    example: "ThyCute"
  }),

  UserPassword: SwaggerTypes.password({ example: "Test.123" }),

  UserConnection: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    status: SwaggerTypes.enum(['following', 'blocking']),
    fromUserId: SwaggerTypes.string(),
    toUserId: SwaggerTypes.string(),
  }),

  ConnectionsOfAUser: SwaggerTypes.object({
    blockerIds: SwaggerTypes.array(SwaggerTypes.string()),
    blockingUserIds: SwaggerTypes.array(SwaggerTypes.string()),
    followerIds: SwaggerTypes.array(SwaggerTypes.string()),
    followingUserIds: SwaggerTypes.array(SwaggerTypes.string()),
    friendIds: SwaggerTypes.array(SwaggerTypes.string()),
  }),

  Image: SwaggerTypes.object({
    uploaderId: SwaggerTypes.string(),
    url: SwaggerTypes.string(),
    deleteUrl: SwaggerTypes.string(),
  }),

  Forum: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    creatorId: SwaggerTypes.string({ readOnly: true }),
    title: SwaggerTypes.string(),
    privacy: SwaggerTypes.enum(["Private", "Public"], { nullable: false, example: "public" }),
    content: SwaggerTypes.object(),
    contentCreatedAt: SwaggerTypes.date({ readOnly: true }, { readOnly: true }),
    contentUpdatedAt: SwaggerTypes.date({ readOnly: true }, { readOnly: true }),
    interactionInfoId: SwaggerTypes.string({ readOnly: true }, { readOnly: true }),
    // interactionInfo: SwaggerTypes.ref('InteractionInfo', { readOnly: true }),
    commentIds: SwaggerTypes.array(SwaggerTypes.string(), { readOnly: true }),
    comments: SwaggerTypes.array(SwaggerTypes.ref('Comment'), { readOnly: true }),
    hashtagIds: SwaggerTypes.array(SwaggerTypes.string(), { readOnly: true, example: [] }),
    hashtags: SwaggerTypes.array(SwaggerTypes.ref("Hashtag"), { readOnly: true, example: [] }),
    hashtagNames: SwaggerTypes.array(SwaggerTypes.string(), { writeOnly: true, example: ["Toeists", "English"] })
  }),

  InteractionInfo: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    upvoterIds: SwaggerTypes.array(SwaggerTypes.string(), { example: [] }),
    downvoterIds: SwaggerTypes.array(SwaggerTypes.string(), { example: [] }),
    followerIds: SwaggerTypes.array(SwaggerTypes.string(), { example: [] }),
  }),

  InteractionInfoTypes: SwaggerTypes.enum(["upvote", "downvote", "unvote", "follow", "unfollow"], { example: "upvote" }),

  Comment: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    creatorId: SwaggerTypes.string({ readOnly: true }),
    forumId: SwaggerTypes.string(),
    content: SwaggerTypes.object(),
    contentCreatedAt: SwaggerTypes.date({ readOnly: true }, { readOnly: true }),
    contentUpdatedAt: SwaggerTypes.date({ readOnly: true }, { readOnly: true }),
    interactionInfoId: SwaggerTypes.string({ readOnly: true }, { readOnly: true }),
    // interactionInfo: SwaggerTypes.ref('InteractionInfo', { readOnly: true }),
  }),

  Hashtag: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    name: SwaggerTypes.string({ readOnly: true }),
  }),

  Certificate: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    ownerId: SwaggerTypes.string({ readOnly: true }),
    type: SwaggerTypes.string({ example: "TOEIC" }),
    imageUrl: SwaggerTypes.string({ example: "https://i.imgur.com/cNzoO9b.png" }),
    description: SwaggerTypes.string({ example: "Score: 600" }),
    isVerified: SwaggerTypes.boolean({ readOnly: true }),
  }),

  ConversationMember: SwaggerTypes.object({
    memberId: SwaggerTypes.ref("UserIdentifier"),
    role: SwaggerTypes.enum(["admin", "none"], { readOnly: true }),
    hasSeen: SwaggerTypes.boolean({ readOnly: true }),
    hasMuted: SwaggerTypes.boolean({ readOnly: true }),
  }),
  
  Conversation: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    name: SwaggerTypes.string({ example: "Class A1"}),    
    memberIds: SwaggerTypes.array(SwaggerTypes.ref("UserIdentifier"), { writeOnly: true }),
    members: SwaggerTypes.array(SwaggerTypes.ref("ConversationMember"), { readOnly: true }),
    type: SwaggerTypes.enum(["private", "group"]),
  }), 

  Message: SwaggerTypes.object({
    _id: SwaggerTypes.string({ readOnly: true }),
    isSystemMessage: SwaggerTypes.boolean(),
    senderId: SwaggerTypes.ref("UserIdentifier"),
    conversationId: SwaggerTypes.string(),
    text: SwaggerTypes.string(),
    attachedContent: SwaggerTypes.object(),
  }),

  SearchUserQuery: SwaggerTypes.object({
    text: SwaggerTypes.string(),
    page: SwaggerTypes.number(),
    pageSize: SwaggerTypes.number(),
    hashtags: SwaggerTypes.boolean(),
  }),

  SearchUserResult: SwaggerTypes.object({
    query: SwaggerTypes.ref("SearchUserQuery"),
    count: SwaggerTypes.number({ description: "The total number of items before pagination." }),
    data: SwaggerTypes.ref("User")
  })
})

const swaggerPaths = Object.freeze({
  ...authorizationSwaggerPaths,
  ...userConnectionsSwaggerPaths,
  ...usersSwaggerPaths,
  ...filesSwaggerPaths,
  ...forumsSwaggerPaths,
  ...commentsSwaggerPaths,
  ...certificatesSwaggerPaths,
  ...hashtagsSwaggerPaths,
  ...conversationsSwaggerPaths,
  ...searchSwaggerPaths,
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

export const getAppSwaggerSpecs = (serverUrl) => {
  /** @type {swaggerJsDoc.Options} */
  const swaggerOptions = {
    swaggerOptions: {
    },

    definition: {
      openapi: "3.0.0",
      info: {
        title: "Toeists API",
        version: "1.0.0",
      },
      servers: [{ url: `${serverUrl}/api`, },],

      components: {
        securitySchemes: {
          jwt: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT"
          },
        },
        schemas: swaggerSchemas,
      },

      paths: swaggerPaths,
      security: [{ jwt: [] }],
    },
    apis: [],
  };

  return swaggerJsDoc(swaggerOptions);
}