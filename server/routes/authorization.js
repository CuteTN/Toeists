import express from "express";
import { authorizeMdw } from "../middlewares/authorization.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";

export const authorizationRouter = express.Router();

authorizationRouter.get("/", authorizeMdw, (_, res) => res.sendStatus(httpStatusCodes.ok));
authorizationRouter.head("/", authorizeMdw, (_, res) => res.sendStatus(httpStatusCodes.ok));