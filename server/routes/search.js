import express from 'express'
import * as controllers from '../controllers/search.js'
import { extractUserTokenMdw } from '../middlewares/authorization.js';
import { createSwaggerPath, SwaggerTypes } from '../utils/swagger.js';

export const searchRouter = express.Router();

searchRouter.post("/users/data", extractUserTokenMdw, controllers.searchForUsers);

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
}