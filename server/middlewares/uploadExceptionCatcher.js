import express from 'express'
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** 
 * This function does NOT work at the moment.
 * TODO: Needs some review later
 * @type {express.RequestHandler} 
 * */
export const uploadExceptionCatcherMdw = async (req, res, next) => {
  try {
    await next();
  }
  catch(error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while uploading the file.", error })
  }
}