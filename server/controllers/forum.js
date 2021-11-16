import express from 'express'
import { Forum, FORUM_VIRTUAL_FIELDS } from '../models/forum.js'
import { InteractionInfo } from '../models/interactionInfo.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { alterInteractionInfo } from '../services/interactionInfo.js'


/** @type {express.RequestHandler} */
export const createForum = async (req, res, next) => {
  const newForum = req.body;
  const creatorId = req.attached.decodedToken.userId;

  const interactionInfo = await InteractionInfo.create({});

  delete newForum.commentIds;
  newForum.creatorId = creatorId;
  newForum.contentCreatedAt = Date.now();
  newForum.contentUpdatedAt = Date.now();
  newForum.interactionInfoId = interactionInfo._id;

  try {
    const createdForum = await Forum.create(newForum)
    await createdForum.populate(FORUM_VIRTUAL_FIELDS);
    return res.status(httpStatusCodes.ok).json(createdForum);
  }
  catch (error) {
    await InteractionInfo.findByIdAndDelete(interactionInfo._id);
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while creating a new forum", error });
  }
}


/** @type {express.RequestHandler} */
export const getForums = async (req, res, next) => {
  const forums = await Forum.find().populate(FORUM_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(forums);
}


/** @type {express.RequestHandler} */
export const getForumById = async (req, res, next) => {
  const forum = req.attached.targetedData;
  await forum.populate(FORUM_VIRTUAL_FIELDS)
  return res.status(httpStatusCodes.ok).json(forum);
}


/** @type {express.RequestHandler} */
export const updateForum = async (req, res, next) => {
  const forumToUpdate = req.body;

  delete forumToUpdate.creatorId;
  delete forumToUpdate.contentCreatedAt;
  delete forumToUpdate.interactionInfoId;

  forumToUpdate.contentUpdatedAt = Date.now();
  try {
    const updatedForum = await Forum
      .findByIdAndUpdate(req.params.id, forumToUpdate, { new: true })
      .populate(FORUM_VIRTUAL_FIELDS)

    return res.status(httpStatusCodes.ok).json(updatedForum);
  }
  catch {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while updating the forum." });
  }
}


/** @type {express.RequestHandler} */
export const deleteForum = async (req, res, next) => {
  try {
    await Forum.findByIdAndDelete(req.params.id);
    return res.sendStatus(httpStatusCodes.ok);
  }
  catch {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while deleting the forum." })
  }
}


/** @type {express.RequestHandler} */
export const interactWithForum = async (req, res, next) => {
  try {
    /** @type {import('../services/interactionInfo.js').InteractionInfoTypes} */
    const interactionInfoType = req.query.type;

    if (!interactionInfoType)
      return res.status(httpStatusCodes.badRequest).json({ message: `The query "type" is required.`});

    const forum = req.attached.targetedData;
    await forum.populate(FORUM_VIRTUAL_FIELDS);

    const { interactionInfo } = forum;

    const { userId } = req.attached.decodedToken;
    alterInteractionInfo(interactionInfo, userId, interactionInfoType);

    await interactionInfo.save();
    return res.status(httpStatusCodes.ok).json(forum);
  }
  catch (error) {
    return res.sendStatus(httpStatusCodes.internalServerError).json({ message: "Error while updating the forum's interaction info", error });
  }
}