import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const authorizationRouter = express.Router();

authorizationRouter.get("/",
  authorizeMdw,
  (req, res) =>
    res.status(200).json({
      userId: req.attached.decodedToken.userId,
      username: req.attached.decodedToken.username,
      expiresAt: new Date(req.attached.decodedToken.exp * 1000)
    }));
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