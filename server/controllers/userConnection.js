import express from "express";
import { UserConnection } from "../models/userConnection.js";
import {} from "../types/index.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";

/**
 * @param {UserConnectionStatus} status
 * @returns {express.RequestHandler}
 */
const setUserConnectionFn = (status) => async (req, res, next) => {
  const fromUserId = req.attached.decodedToken.userId;
  const { toUserId } = req.body;

  if (!toUserId)
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "toUserId is required." });

  if (fromUserId === toUserId)
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "fromUserId and toUserId must be difference." });

  try {
    var existingUserConnection = await UserConnection.findOne({
      fromUserId,
      toUserId,
    });
  } catch (error) {
    return res.status(httpStatusCodes.badRequest).json(error);
  }

  const userConnectionToUpdate = { status, fromUserId, toUserId };

  try {
    if (existingUserConnection) {
      userConnectionToUpdate._id = existingUserConnection._id;
      const updatedUserConnection = await UserConnection.findByIdAndUpdate(
        existingUserConnection._id,
        userConnectionToUpdate,
        { new: true, runValidators: true }
      );
      return res.status(httpStatusCodes.ok).json(updatedUserConnection);
    } else {
      const userConnectionDoc = new UserConnection(userConnectionToUpdate);
      await userConnectionDoc.save();
      return res.status(httpStatusCodes.ok).json(userConnectionDoc);
    }
  } catch (error) {
    return res.status(httpStatusCodes.badRequest).json(error);
  }
};

/**
 * @param {UserConnectionStatus} currentStatus
 * @returns {express.RequestHandler}
 */
const unsetUserConnectionFn = (currentStatus) => async (req, res, next) => {
  const fromUserId = req.attached.decodedToken.userId;
  const { toUserId } = req.body;

  if (!toUserId)
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "toUserId is required." });

  try {
    var existingUserConnection = await UserConnection.findOne({
      fromUserId,
      toUserId,
    });
  } catch (error) {
    return res.status(httpStatusCodes.badRequest).json(error);
  }

  if (
    existingUserConnection &&
    existingUserConnection.status === currentStatus
  ) {
    await UserConnection.findByIdAndDelete(existingUserConnection._id);
    return res.sendStatus(httpStatusCodes.ok);
  } else return res.sendStatus(httpStatusCodes.unprocessableEntity);
};

export const follow = setUserConnectionFn("following");
export const block = setUserConnectionFn("blocking");

export const unfollow = unsetUserConnectionFn("following");
export const unblock = unsetUserConnectionFn("blocking");
