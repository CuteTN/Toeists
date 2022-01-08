import express from 'express'
import mongoose from 'mongoose'
import { httpStatusCodes } from '../utils/httpStatusCode.js';
import { uploadToImgbbAndSaveDb } from '../services/images.js';
import { gridFsBucket } from '../index.js';

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

/** @type {express.RequestHandler} */
export const uploadImageWithString = async (req, res, next) => {
  const uploaderId = req.attached.decodedToken.userId;

  /** Expected a base64 encoded string or a URL */
  const imageStr = req.body.image;

  let image = null;
  try {
    image = await uploadToImgbbAndSaveDb(uploaderId, imageStr);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ error });
  }

  return res.status(httpStatusCodes.ok).json(image);
}


/** @type {express.RequestHandler} */
export const uploadFile = async (req, res, next) => {
  const { file } = req;
  if (file)
    return res.status(httpStatusCodes.ok).json({ file });
  return res.sendStatus(httpStatusCodes.internalServerError);
}


/** @type {express.RequestHandler} */
export const getFile = async (req, res, next) => {
  const { fileType, filename } = req.params;
  if (!(fileType && filename))
    return res.status(httpStatusCodes.badRequest).json({ message: "fileType, filename is required." })

  try {
    gridFsBucket.find({ filename }).toArray((error, files) => {
      if (!files?.length)
        return res.sendStatus(httpStatusCodes.notFound);

      const file = files[0];
      if (!file.metadata.mimetype?.startsWith(fileType?.toLowerCase()))
        return res.status(httpStatusCodes.badRequest).json({ message: "Unmatched file type." })

      gridFsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    });
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while retrieving the file.", error })
  }
}


/** @type {express.RequestHandler} */
export const deleteFile = async (req, res, next) => {
  const { fileType, filename } = req.params;
  const { userId } = req.attached.decodedToken;

  if (!(fileType && filename && userId))
    return res.status(httpStatusCodes.badRequest).json({ message: "fileType, filename is required." });

  try {
    gridFsBucket.find({ filename }).toArray((error, files) => {
      if (!files?.length)
        return res.sendStatus(httpStatusCodes.notFound);

      const file = files[0];
      if (!file.metadata.mimetype?.startsWith(fileType?.toLowerCase()))
        return res.status(httpStatusCodes.badRequest).json({ message: "Unmatched file type." })
      if (file.metadata.uploaderId.toString() !== userId.toString())
        return res.status(httpStatusCodes.forbidden).json({ message: "You don't have permission to delete this file." });

      const fileId = file._id;
      mongoose.connection.db.collection('uploads.files').deleteOne({ _id: fileId })
      mongoose.connection.db.collection('uploads.chunks').deleteMany({ files_id: fileId })

      return res.sendStatus(httpStatusCodes.accepted);
    });
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while retrieving the file.", error })
  }
}