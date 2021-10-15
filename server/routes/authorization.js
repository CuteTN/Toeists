import express from "express";
import { authorize } from "../middlewares/authorization.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";

export const authorizationRouter = express.Router();

authorizationRouter.get("/", authorize, (_, res) => res.sendStatus(httpStatusCodes.ok));
authorizationRouter.head("/", authorize, (_, res) => res.sendStatus(httpStatusCodes.ok));