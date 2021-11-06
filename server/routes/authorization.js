import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const authorizationRouter = express.Router();

authorizationRouter.get("/", authorizeMdw, (_, res) => res.sendStatus(httpStatusCodes.ok));
authorizationRouter.head("/", authorizeMdw, (_, res) => res.sendStatus(httpStatusCodes.ok));

const controllerName = "authorization";
export const authorizationSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Check if the current access token is valid.",
      [controllerName],
    ),

    head: createSwaggerPath(
      "Check if the current access token is valid.",
      [controllerName],
    )
  },
}