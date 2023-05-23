import express from "express";
import * as controllers from "../controllers/system.js";

export const systemRouter = express.Router();

systemRouter.post("/reload-browser", controllers.requestReloadBrowser);