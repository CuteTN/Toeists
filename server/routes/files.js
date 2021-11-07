import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import * as controllers from '../controllers/files.js'
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() });
export const filesRouter = express.Router();

filesRouter.post('/image', authorizeMdw, upload.single("image"), controllers.uploadImage);

const controllerName = "files"
export const fileSwaggerPaths = {
  [`/${controllerName}/image`]: {
    post: createSwaggerPath(
      "Upload an image to imgbb server and get the url.",
      [controllerName],
      null,
      SwaggerTypes.object({
        image: SwaggerTypes.file(),
      }),
      SwaggerTypes.ref("Image"),
      true
    )
  },
}