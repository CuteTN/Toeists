import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { verifyJwt } from "../services/jwtHelper.js";
import express from "express";
import { User } from "../models/user.js";

/**
 * @param {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {express.NextFunction} next
 */
export const authorizeMdw = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split?.(" ")?.[1];
    if (!token) return res.status(httpStatusCodes.unauthorized).json();

    const verification = verifyJwt(token);

    if (!verification.isValid)
      return res
        .status(httpStatusCodes.unauthorized)
        .json({ message: `Invalid token.`, detail: verification.error });
    if (verification.payload.type !== "a")
      return res
        .status(httpStatusCodes.unauthorized)
        .json({ message: `Invalid token. (Only access tokens are accepted)` });

    const userId = verification.payload.userId;
    const user = await User.findById(userId);

    if (!user)
      return res.status(httpStatusCodes.notFound).json({ message: "User does not exist." });

    if (!user.isActivated)
      return res.status(httpStatusCodes.forbidden).json({ message: "User has not activated their account." })

    if (!req.attached) req.attached = {};
    req.attached.decodedToken = verification.payload;
    req.attached.user = user;
    req.userId = userId;

    next?.();
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ message: error.message });
  }
};
