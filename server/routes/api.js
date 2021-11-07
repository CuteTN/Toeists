import express from "express";
import { usersRouter } from "./users.js";
import { authenticationRouter } from "./authentication.js";
import { authorizationRouter } from "./authorization.js";
import { userConnectionRouter } from "./userConnection.js";
import { filesRouter } from "./files.js";

export const apiRouter = express.Router();

apiRouter.use("/authentication", authenticationRouter);
apiRouter.use("/authorization", authorizationRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/user-connections", userConnectionRouter);

apiRouter.use("/files", filesRouter);
