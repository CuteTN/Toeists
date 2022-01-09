import express from 'express'
import { ContestPart } from '../models/contestPart.js';
import { scanAndMoveContestAnswers, validateContestPart } from '../services/contestPart.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** @type {express.RequestHandler} */
export const createContestPart = async (req, res) => {
  const creatorId = req.attached.decodedToken.userId;
  const contestPartDto = req.body;

  if (!contestPartDto)
    return res.status(httpStatusCodes.badRequest).json({ message: "The request body is required." });

  contestPartDto.creatorId = creatorId;
  try {
    scanAndMoveContestAnswers(contestPartDto); 
    validateContestPart(contestPartDto);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: error })
  }

  try {
    const createdContestPart = await ContestPart.create(contestPartDto);
    return res.status(httpStatusCodes.ok).json(createdContestPart);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while creating new contest part.", error });
  }
}


/** @type {express.RequestHandler} */
export const getAllContestParts = async (req, res) => {
  const contestParts = await ContestPart.find();
  return res.status(httpStatusCodes.ok).json(contestParts);
}


/** @type {express.RequestHandler} */
export const getContestPartById = async (req, res) => {
  const contestPart = req.attached.targetedData;
  return res.status(httpStatusCodes.ok).json(contestPart);
}


/** @type {express.RequestHandler} */
export const deleteContestPart = async (req, res) => {
  const contestPartId = req.params.id;

  try {
    await ContestPart.findByIdAndDelete(contestPartId);
    return res.sendStatus(httpStatusCodes.ok);
  }
  catch(error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while deleting a contest part.", error });
  }
}