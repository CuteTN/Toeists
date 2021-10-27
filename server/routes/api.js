import express from "express";
import { usersRouter } from "./users.js";
import { authenticationRouter } from './authentication.js'
import { authorizationRouter } from "./authorization.js";
import { userConnectionRouter } from "./userConnection.js";

export const apiRouter = express.Router();

/**
 * documentations
 */
apiRouter.get("/", function (req, res, next) {
  res.send(`
    <code>API documentation coming soon...</code>
  `)
});

apiRouter.use('/authentication', authenticationRouter);
apiRouter.use('/authorization', authorizationRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/user-connections', userConnectionRouter);