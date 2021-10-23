import express from "express";
import * as controller from "../controllers/users.js";
import { autoTransformToUserIdsFn } from '../middlewares/autoTransformToUserIds.js'
import { authorize } from '../middlewares/authorization.js'

export const usersRouter = express.Router();

const reqParamsToUserId = autoTransformToUserIdsFn(
  [req => req.params, 'id']
)

usersRouter.get('/', controller.getAllUsers);
usersRouter.get('/:id', reqParamsToUserId, controller.getUserById);
usersRouter.put('/:id', authorize, reqParamsToUserId, controller.updateUser);