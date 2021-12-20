import express from 'express'
import mongoose from 'mongoose'
import { Forum } from "../models/forum.js";
import { checkIsForumVisibleByUser } from "../services/forum.js";
import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { TARGETED_DATA_EXTRACTOR } from './findById.js';

export const FORUM_ID_FROM_TARGETED_DATA_EXTRACTOR = (req) => TARGETED_DATA_EXTRACTOR(req)?.forumId;
export const FORUM_ID_FROM_BODY_EXTRACTOR = req => req.body?.forumId; 

/** @type {(forumIdExtractor: ForumIdExtractor) => express.RequestHandler} */
export const checkIsCommentFromVisibleForumMdwFn = (forumIdExtractor) => async (req, res, next) => {
  try {
    const forumId = forumIdExtractor(req); 
    var forum = await Forum.findById(forumId);
    if (!forum)
      throw "Not found."
  }
  catch {
    return res.status(httpStatusCodes.badRequest).json({ message: "Can not find forum."});
  }

  const userId = req.attached?.decodedToken?.userId;
  if(!checkIsForumVisibleByUser(forum, userId))
    return res.status(httpStatusCodes.forbidden).json({ message: "The forum is not visible to this user." })

  next();
}

export const checkIsCommentOwner = (comment, req) => {
  if (!comment.creatorId.equals(req.attached?.decodedToken?.userId))
    return "Only the comment's creator can access this data."
}

/**
 * @typedef {(req: Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>) => any} ForumIdExtractor
 */