import express from 'express'
import { ContestPart, CONTEST_PART_VIRTUAL_FIELDS } from '../models/contestPart.js';
import { ContestSubmission } from '../models/contestSubmission.js';
import { scanAndMoveContestAnswers, validateContestPart } from '../services/contestPart.js';
import { getOverallSubmissionsInfo } from '../services/contestSubmission.js';
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
  const contestParts = await ContestPart.find().populate(CONTEST_PART_VIRTUAL_FIELDS);
  const userId = req?.attached?.decodedToken?.userId;

  const contestPartsPOJOs = contestParts.map(cp => cp.toObject());
  for (let cp of contestPartsPOJOs) {
    cp.submissions = {
      overall: await getOverallSubmissionsInfo(cp._id),
      personal: userId? await ContestSubmission.findOne({ userId, contestPartId: cp._id }) : null, 
    }
  }
  
  return res.status(httpStatusCodes.ok).json(contestPartsPOJOs);
}


/** @type {express.RequestHandler} */
export const getContestPartById = async (req, res) => {
  const contestPart = req.attached.targetedData;
  await contestPart?.populate(CONTEST_PART_VIRTUAL_FIELDS);

  const userId = req?.attached?.decodedToken?.userId;
  const contestPartPOJO = contestPart?.toObject();
  contestPartPOJO.submissions = {
    overall: await getOverallSubmissionsInfo(contestPartPOJO._id),
    personal: userId? await ContestSubmission.findOne({ userId, contestPartId: contestPartPOJO._id }) : null, 
  }

  return res.status(httpStatusCodes.ok).json(contestPartPOJO);
}


/** @type {express.RequestHandler} */
export const deleteContestPart = async (req, res) => {
  const contestPartId = req.params.id;

  try {
    await ContestPart.findByIdAndDelete(contestPartId);
    return res.sendStatus(httpStatusCodes.ok);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while deleting a contest part.", error });
  }
}


/** @type {express.RequestHandler} */
export const addContestSubmission = async (req, res) => {
  try {
    const { userId } = req.attached.decodedToken;
    const contestPartId = req.params.id;

    const existingSubmission = await ContestSubmission.findOne({ userId, contestPartId });
    if (existingSubmission)
      return res.status(httpStatusCodes.unprocessableEntity).json({ message: "The user have already submitted to this contest." })

    const contestPart = await ContestPart.findById(contestPartId).select("+answers");
    const userAnswers = req.body.answers ?? {};

    if (!contestPart)
      return res.status(httpStatusCodes.notFound).json({ message: "Couldn't find the contest part." });
    if (!Array.isArray(userAnswers))
      return res.status(httpStatusCodes.badRequest).json({ message: "'answers' field is required and must be an array." });
    if (contestPart.creatorId === userId)
      return res.status(httpStatusCodes.unprocessableEntity).json({ message: "A creator cannot submit answers to their own contest." })

    let score = 0;
    contestPart.answers?.forEach((ans, i) => score += userAnswers[i]?.toUpperCase?.() === ans?.toUpperCase?.() ? 1 : 0);

    const createdSubmission = await ContestSubmission.create({
      userId,
      contestPartId,
      score,
      expectedAnswers: contestPart.answers,
      actualAnswers: userAnswers,
    })

    return res.status(httpStatusCodes.ok).json(createdSubmission);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while submitting to a contest.", error })
  }
}