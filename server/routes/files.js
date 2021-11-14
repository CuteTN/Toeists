import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import * as controllers from '../controllers/files.js'
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() });
export const filesRouter = express.Router();

filesRouter.post('/image', authorizeMdw, upload.single("image"), controllers.uploadImage);
filesRouter.post('/image/str', authorizeMdw, controllers.uploadImageWithString);

const controllerName = "files"
export const filesSwaggerPaths = {
  [`/${controllerName}/image`]: {
    post: createSwaggerPath(
      "Upload an image to imgbb server and get the url. If the returned url exists, just return the old one.",
      [controllerName],
      null,
      SwaggerTypes.object({
        image: SwaggerTypes.file(),
      }),
      SwaggerTypes.ref("Image"),
      true
    )
  },

  [`/${controllerName}/image/str`]: {
    post: createSwaggerPath(
      "Upload an image to imgbb server and get the url with **Base64 encoded** string or a **URL**. If the returned url exists, just return the old one.",
      [controllerName],
      null,
      SwaggerTypes.object({
        image: SwaggerTypes.string(),
      }),
      SwaggerTypes.ref("Image"),
    )
  },
}