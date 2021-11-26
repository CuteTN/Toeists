import express from 'express'
import mongoose from 'mongoose'
import { User } from '../models/user.js'
import { findUserByIdentifier } from '../services/users.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js'

/**
 * @returns {string} returns a string, NOT mongoose objectID
 */
const convertIdentifierToUserId = (strToConvert, users) => {
  // null
  if (!strToConvert)
    return null;

  // already an object Id
  if (mongoose.isValidObjectId(strToConvert))
    return strToConvert;

  // username or email
  const user = findUserByIdentifier(strToConvert, users);
  if (!user?.id)
    throw new Error(`Failed to convert user identifier ${strToConvert}`);

  return user.id;
}


/** @type {(...selectors: Selector[]) => express.RequestHandler} */
export const autoTransformToUserIdsMdwFn =
  (...selectors) =>
    async (req, res, next) => {
      let targetedParent = null;
      const users = await User.find();
      let error = null;

      selectors.forEach((selector) => {
        try {
          targetedParent = selector[0](req, res);
        } catch {
          targetedParent = null;
        }

        if (!targetedParent) return;

        const valueToConvert = targetedParent[selector[1]];
        if (!valueToConvert)
          return;

        let newValue = valueToConvert;

        try {
          if (typeof valueToConvert === "string")
            newValue = convertIdentifierToUserId(valueToConvert, users);

          if (Array.isArray(valueToConvert))
            newValue = valueToConvert.map(identifier => convertIdentifierToUserId(identifier, users))
        }
        catch (err) {
          error = err;
        }

        targetedParent[selector[1]] = newValue;
      });

      if (error)
        return res.status(httpStatusCodes.ok).json({ message: "Unrecognised user identifier.", error });
      next?.();
    };

/**
 * @typedef {"id" | "username" | "email"} UserTransform
 */

/**
 * @callback ParentSelector
 * @param {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>?} res
 * @returns {any}
 */

/**
 * @typedef {[ParentSelector, string]} Selector
 */
