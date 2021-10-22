import express from "express";
import * as controllers from "../controllers/userConnection.js";
import { authorize } from "../middlewares/authorization.js";
import { autoTransformToUserIdsFn } from "../middlewares/autoTransformToUserIds.js";

export const userConnectionRouter = express.Router();

const reqToUserIds = autoTransformToUserIdsFn(
  [req => req.body, "toUserId"]
);

userConnectionRouter.post("/follow", authorize, reqToUserIds, controllers.follow);
userConnectionRouter.post("/block", authorize, reqToUserIds, controllers.block);
userConnectionRouter.delete("/unfollow", authorize, reqToUserIds, controllers.unfollow);
userConnectionRouter.delete("/unblock", authorize, reqToUserIds, controllers.unblock);