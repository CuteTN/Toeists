import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { RefreshToken } from '../models/refreshToken.js';
import express from "express";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import mongoose from "mongoose";
import { UserConnection } from "../models/userConnection.js";
import { getAllConnectionsOfUser } from "../services/userConnection.js";
import { findUserByIdentifier, generateUserTokens } from "../services/users.js";
import { verifyJwt } from "../services/jwtHelper.js";

/** @type {express.RequestHandler} */
export const createUser = async (req, res, next) => {
  const newUserDto = { ...req.body };
  if (!newUserDto.password)
    return res.status(httpStatusCodes.badRequest).json({ message: "Password is required!" });

  const hashedPassword = await bcrypt.hash(newUserDto.password, 12);
  newUserDto.hashedPassword = hashedPassword;
  delete newUserDto.password;

  /** @type {mongoose.Document} */
  const newUser = new User(newUserDto);

  try { await newUser.validate(); }
  catch (error) { return res.status(httpStatusCodes.badRequest).json(error) }

  await newUser.save();
  return res.status(httpStatusCodes.ok).json(newUser);
}


/** @type {express.RequestHandler} */
export const signIn = async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier)
    return res.status(httpStatusCodes.badRequest).json({ message: "Identifier is required." });
  if (!password)
    return res.status(httpStatusCodes.badRequest).json({ message: "Password is required." });

  const allUsers = await User.find();
  const user = findUserByIdentifier(identifier, allUsers);

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: `User ${identifier} does not exist.` })

  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordCorrect)
    return res.status(httpStatusCodes.badRequest).json({ message: "Wrong password." });

  const tokens = generateUserTokens(user);

  const noRefresh = req.query["no-refresh"] !== undefined && req.query["no-refresh"] !== "false";
  if (!noRefresh)
    await RefreshToken.create({ token: tokens.refreshToken, });
  else
    delete tokens.refreshToken;

  return res.status(httpStatusCodes.ok).json({ ...tokens, username: user.username, userId: user._id });
}


/** @type {express.RequestHandler} */
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(httpStatusCodes.badRequest).json({ message: "A refresh token is required." })

  const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken })

  let userId = null;
  try { userId = verifyJwt(refreshToken).payload.userId; }
  catch { return res.status(httpStatusCodes.badRequest).json({ message: "Invalid token" }) }

  if (!userId)
    return res.status(httpStatusCodes.badRequest).json({ message: "Invalid token (no user ID in payload)" })

  const user = await User.findById(userId);
  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: "The owner of the token doesn't exist." })

  if (!refreshTokenDoc)
    return res.status(httpStatusCodes.badRequest).json({ message: "Invalid token (not in white-list)" });

  const tokens = generateUserTokens(user);
  await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, { token: tokens.refreshToken });

  return res.status(httpStatusCodes.ok).json(tokens);
}


/** @type {express.RequestHandler} */
export const invalidateRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(httpStatusCodes.badRequest).json({ message: "A refresh token is required." })

  await RefreshToken.findOneAndDelete({ token: refreshToken });
  return res.sendStatus(httpStatusCodes.ok);
}


/** @type {(string) => express.RequestHandler} */
export const requestConfirmEmail = (requestType) => (req, res, next) => {
  const { userId } = req?.attached?.decodedToken ?? {};

  // if (!userId) 
  //   return res.sendStatus(code)
}


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
  const { userId } = req?.attached?.decodedToken ?? {};
  const { id } = req.params;
  const updatingData = req.body;

  if (id !== userId)
    return res.status(httpStatusCodes.forbidden).json({ message: "Cannot update other's data" });

  delete updatingData.password;
  delete updatingData.hashedPassword;
  delete updatingData.username;
  delete updatingData.email;

  // if (updatingData.password) {
  //   const hashedPassword = await bcrypt.hash(updatingData.password, 12);
  //   updatingData.hashedPassword = hashedPassword;
  //   delete updatingData.password;
  // }

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