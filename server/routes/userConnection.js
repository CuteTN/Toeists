import express from "express";
import * as controllers from "../controllers/userConnection.js";
import { authorize } from "../middlewares/authorization.js";

export const userConnectionRouter = express.Router();

userConnectionRouter.post("/follow", authorize, controllers.follow);
userConnectionRouter.post("/block", authorize, controllers.block);
userConnectionRouter.delete("/unfollow", authorize, controllers.unfollow);
userConnectionRouter.delete("/unblock", authorize, controllers.unblock);