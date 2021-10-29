import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import express from "express";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import mongoose from "mongoose";
import { UserConnection } from "../models/userConnection.js";
import { getAllConnectionsOfUser } from "../services/userConnection.js";

/** @type {express.RequestHandler} */
export const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  return res.status(httpStatusCodes.ok).send(users);
};

/** @type {express.RequestHandler} */
export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(httpStatusCodes.notFound).send("User not found");

  return res.status(httpStatusCodes.ok).send(user);
};

/** @type {express.RequestHandler} */
export const getUserConnections = async (req, res, next) => {
  const userId = req.params.id;

  const existingUser = await User.findById(userId);
  if (!existingUser) return res.sendStatus(httpStatusCodes.notFound);

  const userConnections = await UserConnection.find();

  const result = getAllConnectionsOfUser(userId, userConnections);
  return res.status(httpStatusCodes.ok).json(result);
};

/** @type {express.RequestHandler} */
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const updatingData = req.body;

  if (updatingData.hashedPassword) delete updatingData.hashedPassword;

  if (updatingData.password) {
    const hashedPassword = await bcrypt.hash(updatingData.password, 12);
    updatingData.hashedPassword = hashedPassword;
    delete updatingData.password;
  }

  if (!mongoose.isValidObjectId(id))
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Invalid ID." });

  const existedUser = await User.findById(id);
  if (!existedUser) return res.sendStatus(httpStatusCodes.notFound);

  try {
    var updatedUser = await User.findByIdAndUpdate(id, updatingData, {
      new: true,
    });
  } catch (error) {
    return res.status(httpStatusCodes.badRequest).json(error);
  }

  return res.status(httpStatusCodes.ok).json(updatedUser);
};
