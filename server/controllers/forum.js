import express from "express";
import { Forum, FORUM_VIRTUAL_FIELDS } from "../models/forum.js";
import { InteractionInfo } from "../models/interactionInfo.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { alterInteractionInfo } from "../services/interactionInfo.js";
import {
  findExistingHashtags,
  reduceHashtagPreferences,
  upsertHashtagPreferences,
} from "../services/hashtag.js";
import {
  CHECK_EQUALITY_DEFAULT,
  removeDuplication,
} from "../utils/arraySet.js";

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

  let hashtagNames = [];

  if (Array.isArray(newForum.hashtagNames)) {
    hashtagNames = removeDuplication(
      newForum.hashtagNames,
      CHECK_EQUALITY_DEFAULT
    );
    await upsertHashtagPreferences(hashtagNames);
    newForum.hashtagIds = (await findExistingHashtags(hashtagNames)).map(
      (ht) => ht._id
    );
  } else {
    newForum.hashtagIds = [];
  }

  try {
    const createdForum = await Forum.create(newForum);
    await createdForum.populate(FORUM_VIRTUAL_FIELDS);
    return res.status(httpStatusCodes.ok).json(createdForum);
  } catch (error) {
    await InteractionInfo.findByIdAndDelete(interactionInfo._id);
    await reduceHashtagPreferences(hashtagNames);
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Error while creating a new forum", error });
  }
};

/** @type {express.RequestHandler} */
export const getForums = async (req, res, next) => {
  const forums = await Forum.find().populate(FORUM_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(forums);
};

/** @type {express.RequestHandler} */
export const getForumById = async (req, res, next) => {
  const forum = req.attached.targetedData;
  await forum.populate(FORUM_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(forum);
};

/** @type {express.RequestHandler} */
export const updateForum = async (req, res, next) => {
  const forumToUpdate = req.body;
  const currentForum = req.attached.targetedData;
  await currentForum.populate?.("hashtags");

  delete forumToUpdate.creatorId;
  delete forumToUpdate.contentCreatedAt;
  delete forumToUpdate.interactionInfoId;
  forumToUpdate.contentUpdatedAt = Date.now();

  const flagUpdateHashtags = Array.isArray(forumToUpdate.hashtagNames);
  let oldHashtagNames = [];
  let newHashtagNames = [];

  if (flagUpdateHashtags) {
    oldHashtagNames = currentForum.hashtags.map((ht) => ht.name);
    await reduceHashtagPreferences(oldHashtagNames);

    newHashtagNames = removeDuplication(
      forumToUpdate.hashtagNames,
      CHECK_EQUALITY_DEFAULT
    );
    await upsertHashtagPreferences(newHashtagNames);
    forumToUpdate.hashtagIds = (
      await findExistingHashtags(newHashtagNames)
    ).map((ht) => ht._id);
  }

  try {
    const updatedForum = await Forum.findByIdAndUpdate(
      req.params.id,
      forumToUpdate,
      { new: true, runValidators: true }
    ).populate(FORUM_VIRTUAL_FIELDS);

    return res.status(httpStatusCodes.ok).json(updatedForum);
  } catch (error) {
    // revert hashtag update
    if (flagUpdateHashtags) {
      await upsertHashtagPreferences(oldHashtagNames);
      await reduceHashtagPreferences(newHashtagNames);
    }

    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Error while updating the forum.", error });
  }
};

/** @type {express.RequestHandler} */
export const deleteForum = async (req, res, next) => {
  try {
    // NOTE: no need to update hashtags here because mongoose middleware has already done the job

    await Forum.findByIdAndDelete(req.params.id);
    return res.sendStatus(httpStatusCodes.ok);
  } catch {
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ message: "Error while deleting the forum." });
  }
};

/** @type {express.RequestHandler} */
export const interactWithForum = async (req, res, next) => {
  try {
    /** @type {import('../services/interactionInfo.js').InteractionInfoTypes} */
    const interactionInfoType = req.query.type;

    if (!interactionInfoType)
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: `The query "type" is required.` });

    const forum = req.attached.targetedData;
    await forum.populate(FORUM_VIRTUAL_FIELDS);

    const { interactionInfo } = forum;

    const { userId } = req.attached.decodedToken;
    alterInteractionInfo(interactionInfo, userId, interactionInfoType);

    await interactionInfo.save();
    return res.status(httpStatusCodes.ok).json(forum);
  } catch (error) {
    return res
      .status(httpStatusCodes.internalServerError)
      .json({
        message: "Error while updating the forum's interaction info",
        error,
      });
  }
};
