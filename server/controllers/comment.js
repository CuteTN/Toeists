import express from "express";
import { Comment, COMMENT_VIRTUAL_FIELDS } from "../models/comment.js";
import { InteractionInfo } from "../models/interactionInfo.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { alterInteractionInfo } from "../services/interactionInfo.js";
import mongoose from "mongoose";
import { Forum } from "../models/forum.js";
import { sendNoti_UpvoteMedia } from "../services/notification/interactionInfo.js";
import { sendNoti_CreateComment, sendNoti_UpdateComment } from "../services/notification/comment.js";

/** @type {express.RequestHandler} */
export const createComment = async (req, res, next) => {
  const newComment = req.body;

  const creatorId = req.attached.decodedToken.userId;

  const interactionInfo = await InteractionInfo.create({});

  delete newComment.commentIds;
  newComment.creatorId = creatorId;
  newComment.contentCreatedAt = Date.now();
  newComment.contentUpdatedAt = Date.now();
  newComment.interactionInfoId = interactionInfo._id;

  const { forumId } = newComment;
  if (!forumId)
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "The field forumId is required." });

  const forum = await Forum.findById(forumId);
  if (!forum)
    return res
      .status(httpStatusCodes.notFound)
      .json({ message: "The forum doesn't exist." });

  try {
    const createdComment = await Comment.create(newComment);
    await createdComment.populate(COMMENT_VIRTUAL_FIELDS);

    await sendNoti_CreateComment(req.attached.user, forum);
    return res.status(httpStatusCodes.ok).json(createdComment);
  } catch (error) {
    await InteractionInfo.findByIdAndDelete(interactionInfo._id);
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Error while creating a new comment", error });
  }
}

/** @type {express.RequestHandler} @deprecated It is not allowed to retrieve comments by themself */
export const getComments = async (req, res, next) => {
  const filter = {};

  const { forumId } = req.query ?? {};
  if (forumId) {
    if (!mongoose.isValidObjectId(forumId))
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: "Invalid forumId" });

    if (!(await Forum.findById(forumId)))
      return res
        .status(httpStatusCodes.notFound)
        .json({ message: "The forum doesn't exist." });

    filter.forumId = forumId;
  }

  const comments = await Comment.find(filter).populate(COMMENT_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(comments);
};

/** @type {express.RequestHandler} */
export const getCommentById = async (req, res, next) => {
  const comment = req.attached.targetedData;
  await comment.populate(COMMENT_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(comment);
};

/** @type {express.RequestHandler} */
export const updateComment = async (req, res, next) => {
  const commentToUpdate = req.body;

  delete commentToUpdate.creatorId;
  delete commentToUpdate.forumId;
  delete commentToUpdate.contentCreatedAt;
  delete commentToUpdate.interactionInfoId;

  commentToUpdate.contentUpdatedAt = Date.now();
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      commentToUpdate,
      { new: true, runValidators: true }
    ).populate(COMMENT_VIRTUAL_FIELDS);

    const forum = await Forum.findById(updatedComment.forumId);
    if (forum)
      await sendNoti_UpdateComment(req.attached.user, forum);
    return res.status(httpStatusCodes.ok).json(updatedComment);
  } catch {
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Error while updating the comment." });
  }
};

/** @type {express.RequestHandler} */
export const deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    return res.sendStatus(httpStatusCodes.ok);
  } catch {
    return res
      .status(httpStatusCodes.internalServerError)
      .json({ message: "Error while deleting the comment." });
  }
};

/** @type {express.RequestHandler} */
export const interactWithComment = async (req, res, next) => {
  try {
    /** @type {import('../services/interactionInfo.js').InteractionInfoTypes} */
    const interactionInfoType = req.query.type;

    if (!interactionInfoType)
      return res
        .status(httpStatusCodes.badRequest)
        .json({ message: `The query "type" is required.` });

    const comment = req.attached.targetedData;
    await comment.populate(COMMENT_VIRTUAL_FIELDS);

    const { interactionInfo, forumId } = comment;

    const forum = await Forum.findById(forumId)
    if (!forum)
      return res.status(httpStatusCodes.notFound).json({ message: "The forum of this comment does not exist." });

    const { userId } = req.attached.decodedToken;
    alterInteractionInfo(interactionInfo, userId, interactionInfoType);

    await interactionInfo.save();

    if(interactionInfoType === "upvote")
      await sendNoti_UpvoteMedia(req.attached.user, comment, "comment", forumId, forum.title);

    return res.status(httpStatusCodes.ok).json(comment);
  } catch (error) {
    return res.sendStatus(httpStatusCodes.internalServerError).json({
      message: "Error while updating the comment's interaction info",
      error,
    });
  }
};
