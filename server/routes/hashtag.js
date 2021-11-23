import express from "express";
import * as controllers from "../controllers/hashtag.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const hashtagsRouter = express.Router();

hashtagsRouter.get("/", controllers.getAllHashtags);
hashtagsRouter.put("/refresh", controllers.refreshHashtags);

const controllerName = "hashtags";
export const hashtagsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all hashtags.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("Hashtag")),
    )
  },

  [`/${controllerName}/refresh`]: {
    put: createSwaggerPath(
      "Up-to-date hashtags count and clean up the unused ones.",
      [controllerName],
      null,
      null,
      null,
    )
  },
}