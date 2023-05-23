import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import * as controllers from '../controllers/files.js'
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import multer from 'multer'
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto'
import path from 'path'
import dotenv from 'dotenv'
import { uploadExceptionCatcherMdw } from "../middlewares/uploadExceptionCatcher.js";

// DIRTY: Should refactor these environment into a completely different file 
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

const gridFsStorage = new GridFsStorage({
  url: DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      if (!req.params.fileType)
        return reject({ message: "File type was not provided."})

      if (!file.mimetype?.startsWith(req.params.fileType?.toLowerCase()))
        return reject({ message: "Invalid file type." });

      crypto.randomBytes(16, (err, buf) => {
        if (err)
          return reject(err);

        const uploaderId = req?.attached?.decodedToken?.userId;
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          metadata: { uploaderId, mimetype: file.mimetype },
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

// const uploadMemoryStorage = multer({ storage: multer.memoryStorage() });
const uploadGridFsStorage = multer({ storage: gridFsStorage });

export const filesRouter = express.Router();

// filesRouter.post('/image', authorizeMdw, uploadMemoryStorage.single("image"), controllers.uploadImage);
// filesRouter.post('/image/str', authorizeMdw, controllers.uploadImageWithString);

filesRouter.post('/:fileType', authorizeMdw, uploadExceptionCatcherMdw, uploadGridFsStorage.single('file'), controllers.uploadFile);
filesRouter.get('/:fileType/:filename', controllers.getFile);
filesRouter.delete('/:fileType/:filename', authorizeMdw, controllers.deleteFile);

const controllerName = "files"
export const filesSwaggerPaths = {
  // [`/${controllerName}/image`]: {
  //   post: createSwaggerPath(
  //     "Upload an image to imgbb server and get the url. If the returned url exists, just return the old one.",
  //     [controllerName],
  //     null,
  //     SwaggerTypes.object({
  //       image: SwaggerTypes.file(),
  //     }),
  //     SwaggerTypes.ref("Image"),
  //     true
  //   )
  // },

  // [`/${controllerName}/image/str`]: {
  //   post: createSwaggerPath(
  //     "Upload an image to imgbb server and get the url with **Base64 encoded** string or a **URL**. If the returned url exists, just return the old one.",
  //     [controllerName],
  //     null,
  //     SwaggerTypes.object({
  //       image: SwaggerTypes.string(),
  //     }),
  //     SwaggerTypes.ref("Image"),
  //   )
  // },

  [`/${controllerName}/{fileType}/{filename}`]: {
    get: createSwaggerPath(
      "Retrieve a file by its name.",
      [controllerName],
      [
        {
          name: "fileType",
          in: "path",
          schema: SwaggerTypes.enum(["audio", "image"]),
        },
        {
          name: "filename",
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.object(),
      true,
    ),

    delete: createSwaggerPath(
      "Delete a file by its name.",
      [controllerName],
      [
        {
          name: "fileType",
          in: "path",
          schema: SwaggerTypes.enum(["audio", "image"]),
        },
        {
          name: "filename",
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.object(),
      true,
    ),
  },

  [`/${controllerName}/{fileType}`]: {
    post: createSwaggerPath(
      "Upload a file and store it to the mongodb server.",
      [controllerName],
      [
        {
          name: "fileType",
          in: "path",
          schema: SwaggerTypes.enum(["audio", "image"]),
        }
      ],
      SwaggerTypes.object({
        file: SwaggerTypes.file(),
      }),
      SwaggerTypes.object(),
      true,
    )
  },
}