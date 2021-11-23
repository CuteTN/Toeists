import express from 'express'
import { Hashtag } from '../models/hashtag.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { refreshHashtags as refreshHashtagsService } from '../services/hashtag.js'

/** @type {express.RequestHandler} */
export const getAllHashtags = async (req, res, next) => {
  const hashtags = await Hashtag.find();
  return res.status(httpStatusCodes.ok).json(hashtags);
}

/** @type {express.RequestHandler} */
export const refreshHashtags = async (req, res, next) => {
  await refreshHashtagsService();
  return res.sendStatus(httpStatusCodes.accepted);
}