import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { verifyJwt } from "../services/jwtHelper.js";
import express from 'express';

/**
 * @param {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {express.NextFunction} next
 */
export const authorizeMdw = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split?.(" ")?.[1];
    if (!token)
      return res.status(httpStatusCodes.unauthorized).json();

    const verification = verifyJwt(token);

    if (!verification.valid)
      return res.status(httpStatusCodes.unauthorized).json({ message: `Invalid token.`, detail: verification.error });
    if (verification.payload.type !== 'a')
      return res.status(httpStatusCodes.unauthorized).json({ message: `Invalid token. (Only access tokens are accepted)` });

    req.attached ??= {};
    req.attached.decodedToken = verification.payload
    next?.();
  } catch (error) {
    console.error(error);
    return res.status(httpStatusCodes.internalServerError).json({ message: error.message });
  }
};