import express from "express";
import { usersRouter } from "./users.js";
import { authorizationRouter } from "./authorization.js";
import { userConnectionsRouter } from "./userConnection.js";
import { filesRouter } from "./files.js";
import { forumsRouter } from "./forum.js";

export const apiRouter = express.Router();

apiRouter.use("/authorization", authorizationRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/user-connections", userConnectionsRouter);
apiRouter.use("/forums", forumsRouter);

apiRouter.use("/files", filesRouter);
