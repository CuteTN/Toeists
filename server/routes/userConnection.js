import express from "express";
import * as controllers from "../controllers/userConnection.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { autoTransformToUserIdsMdwFn } from "../middlewares/autoTransformToUserIds.js";

export const userConnectionRouter = express.Router();

const reqToUserIds = autoTransformToUserIdsMdwFn([
  (req) => req.body,
  "toUserId",
]);

userConnectionRouter.post(
  "/follow",
  authorizeMdw,
  reqToUserIds,
  controllers.follow
);
userConnectionRouter.post(
  "/block",
  authorizeMdw,
  reqToUserIds,
  controllers.block
);
userConnectionRouter.delete(
  "/unfollow",
  authorizeMdw,
  reqToUserIds,
  controllers.unfollow
);
userConnectionRouter.delete(
  "/unblock",
  authorizeMdw,
  reqToUserIds,
  controllers.unblock
);
