import express from "express";
import { usersRouter } from "./users.js";
import { authorizationRouter } from "./authorization.js";
import { userConnectionsRouter } from "./userConnection.js";
import { filesRouter } from "./files.js";
import { forumsRouter } from "./forum.js";
import { commentsRouter } from "./comment.js";
import { certificatesRouter } from "./certificate.js";
import { hashtagsRouter } from "./hashtag.js";
import { conversationsRouter } from "./conversation.js";
import { searchRouter } from "./search.js";
import { notificationsRouter } from "./notification.js";
import { contestPartRouter } from "./contestPart.js";

export const apiRouter = express.Router();

apiRouter.use("/authorization", authorizationRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/user-connections", userConnectionsRouter);
apiRouter.use("/forums", forumsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/certificates", certificatesRouter);
apiRouter.use("/hashtags", hashtagsRouter);
apiRouter.use("/conversations", conversationsRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/notifications", notificationsRouter);
apiRouter.use("/contest-parts", contestPartRouter);

apiRouter.use("/files", filesRouter);