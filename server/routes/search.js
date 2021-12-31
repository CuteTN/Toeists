import express from 'express'
import * as controllers from '../controllers/search.js'
import { authorizeMdw, extractUserTokenMdw } from '../middlewares/authorization.js';
import { createSwaggerPath, SwaggerTypes } from '../utils/swagger.js';

export const searchRouter = express.Router();

searchRouter.post("/users/data", extractUserTokenMdw, controllers.searchForUsers);
searchRouter.post("/forums/data", extractUserTokenMdw, controllers.searchForForums);
searchRouter.post("/conversations/data", authorizeMdw, controllers.searchForConversations);
searchRouter.get("/:category/history", authorizeMdw, controllers.getSearchHistory);

const controllerName = "search";
export const searchSwaggerPaths = {
  [`/${controllerName}/users/data`]: {
    post: createSwaggerPath(
      "Search for users.",
      [controllerName],
      [
        {
          in: "query",
          name: "no-save",
          schema: SwaggerTypes.boolean(),
        }
      ],
      SwaggerTypes.ref("SearchUserQuery"),
      SwaggerTypes.ref("SearchUserResult"),
    )
  },
  [`/${controllerName}/forums/data`]: {
    post: createSwaggerPath(
      "Search for forums.",
      [controllerName],
      [
        {
          in: "query",
          name: "no-save",
          schema: SwaggerTypes.boolean(),
        }
      ],
      SwaggerTypes.ref("SearchForumQuery"),
      SwaggerTypes.ref("SearchForumResult"),
    )
  },
  [`/${controllerName}/conversations/data`]: {
    post: createSwaggerPath(
      "Search for conversations.",
      [controllerName],
      [
        {
          in: "query",
          name: "no-save",
          schema: SwaggerTypes.boolean(),
        }
      ],
      SwaggerTypes.ref("SearchConversationQuery"),
      SwaggerTypes.ref("SearchConversationResult"),
    )
  },
  [`/${controllerName}/{category}/history`]: {
    get: createSwaggerPath(
      "Get search history.",
      [controllerName],
      [
        {
          in: "path",
          name: "category",
          schema: SwaggerTypes.enum(controllers.ACCEPTED_CATEGORIES),
        }
      ],
      null,
      SwaggerTypes.array(SwaggerTypes.ref("SearchRecord")),
    )
  },
}