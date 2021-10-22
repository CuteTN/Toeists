import express from 'express';
import bcrypt from "bcryptjs";
import { User } from '../models/user.js';
import mongoose from 'mongoose';
import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { findUserByIdentifier, generateUserTokens } from '../services/users.js';
import { verifyJwt } from '../services/jwtHelper.js'
import { RefreshToken } from '../models/refreshToken.js';

/** @type {express.RequestHandler} */
export const signUp = async (req, res, next) => {
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

  (await RefreshToken.create({
    token: tokens.refreshToken,
  }))

  return res.status(httpStatusCodes.ok).json(tokens);
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


