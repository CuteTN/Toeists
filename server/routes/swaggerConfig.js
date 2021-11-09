import { SwaggerTypes } from "../utils/swagger.js"
import swaggerJsDoc from 'swagger-jsdoc';
import { authorizationSwaggerPaths } from "./authorization.js";
import { userConnectionsSwaggerPaths } from "./userConnection.js";
import { usersSwaggerPaths } from "./users.js";
import { fileSwaggerPaths } from "./files.js";

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
    birthday: SwaggerTypes.date()
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
  })
})

const swaggerPaths = Object.freeze({
  ...authorizationSwaggerPaths,
  ...userConnectionsSwaggerPaths,
  ...usersSwaggerPaths,
  ...fileSwaggerPaths,
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