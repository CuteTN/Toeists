import express from "express";
import * as controller from "../controllers/users.js";
import { autoTransformToUserIdsMdwFn } from '../middlewares/autoTransformToUserIds.js'
import { authorizeMdw } from '../middlewares/authorization.js'

export const usersRouter = express.Router();

const reqParamsToUserId = autoTransformToUserIdsMdwFn(
  [req => req.params, 'id']
)

usersRouter.get('/', controller.getAllUsers);
usersRouter.get('/:id', reqParamsToUserId, controller.getUserById);
usersRouter.get('/:id/connections', reqParamsToUserId, controller.getUserConnections);
usersRouter.put('/:id', authorizeMdw, reqParamsToUserId, controller.updateUser);