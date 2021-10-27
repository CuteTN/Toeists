import express from 'express'
import mongoose from 'mongoose'
import { User } from '../models/user.js'
import { findUserByIdentifier } from '../services/users.js'

/** @type {(...selectors: Selector[]) => express.RequestHandler} */
export const autoTransformToUserIdsMdwFn = (...selectors) => async (req, res, next) => {
  let targetedParent = null;
  const users = await User.find();

  selectors.forEach(selector => {
    try { targetedParent = selector[0](req, res); }
    catch { targetedParent = null }

    if (!targetedParent)
      return;

    const strToConvert = targetedParent[selector[1]];

    // null
    if (!strToConvert)
      return;

    // already an object Id
    if (mongoose.isValidObjectId(strToConvert))
      return;

    // username or email
    const user = findUserByIdentifier(strToConvert, users);
    if (!user?.id)
      return;

    targetedParent[selector[1]] = user.id;
  })

  next?.();
}

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