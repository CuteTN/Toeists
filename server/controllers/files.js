import express from 'express'
import { httpStatusCodes } from '../utils/httpStatusCode.js';
import { uploadToImgbbAndSaveDb } from './images.js';

/** @type {express.RequestHandler} */
export const uploadImage = async (req, res, next) => {
  const uploaderId = req.attached.decodedToken.userId;
  const imageB64 = req.file.buffer.toString('base64');

  let image = null;
  try {
    image = await uploadToImgbbAndSaveDb(uploaderId, imageB64);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ error });
  }

  return res.status(httpStatusCodes.ok).json(image);
}
