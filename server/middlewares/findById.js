import express from "express"
import mongoose from "mongoose"
import { httpStatusCodes } from "../utils/httpStatusCode.js";

/** @type {(req: ExpressReq) => string} */
const DEFAULT_ID_EXTRACTOR = (req) => req.params.id;

/** @type {(targetedData: any, req: ExpressReq) => Promise<Boolean>} */
const DEFAULT_FORBIDDEN_CHECKER = () => undefined;

/**
 * Try finding a targeted data by its id first. If there's no data found, response 404 (if enabled).
 * @param {FindByIdMdwFnParams} param0 
 * @returns {express.RequestHandler}
 */
export const findByIdMdwFn = ({
  model,
  idExtractor = DEFAULT_ID_EXTRACTOR,
  enable404 = true,
  forbiddenChecker = DEFAULT_FORBIDDEN_CHECKER,
  enable403 = true
}) => async (req, res, next) => {
  const id = idExtractor(req);

  if (!mongoose.isValidObjectId(id))
    return res.status(httpStatusCodes.badRequest).json({ message: "The provided ID is not valid." });

  const targetedData = await model?.findById(id);

  if (enable404 && !targetedData)
    return res.status(httpStatusCodes.notFound).json({ message: "Targeted data couldn't be found" });

  try {
    const forbiddenMsg = await forbiddenChecker?.(targetedData, req) 
    if (enable403 && forbiddenMsg)
      return res.status(httpStatusCodes.forbidden).json({ message: forbiddenMsg })
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Internal server error while checking user permission." , error });
  }

  if (!req.attached) req.attached = {};
  req.attached.targetedData = targetedData;

  next?.();
}

export const TARGETED_DATA_EXTRACTOR = (req) => req?.attached?.targetedData;

/**
 * @typedef {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} ExpressReq
 */

/**
 * @typedef {object} FindByIdMdwFnParams
 * @property {mongoose.Model} model
 * @property {(req: ExpressReq) => string} idExtractor
 * @property {(targetedData: any, req: ExpressReq) => Promise<string>} forbiddenChecker Returns a string represents the error message
 * @property {boolean} enable404
 * @property {boolean} enable403
 */