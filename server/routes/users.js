import express from "express";
import * as controller from "../controllers/users.js";

export const usersRouter = express.Router();

usersRouter.get('/', controller.getAllUsers);
usersRouter.get('/:id', controller.getUserById);