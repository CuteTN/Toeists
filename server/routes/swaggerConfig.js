import { SwaggerTypes } from "../utils/swagger.js"
import { authenticationSwaggerPaths } from "./authentication.js"
import swaggerJsDoc from 'swagger-jsdoc';
import { authorizationSwaggerPaths } from "./authorization.js";

const swaggerSchemas = Object.freeze({
  User: SwaggerTypes.object({
    id: SwaggerTypes.string({ readOnly: true }),
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

  UserPassword: SwaggerTypes.password({ example: "Test.123" })
})

const swaggerPaths = Object.freeze({
  ...authenticationSwaggerPaths,
  ...authorizationSwaggerPaths,
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

export const getAppSwaggerSpecs = (serverUrl) => {
  /** @type {swaggerJsDoc.Options} */
  const swaggerOptions = {
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