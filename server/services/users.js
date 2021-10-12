import { User } from "../models/user.js";
import mongoose from "mongoose";
import emailValidator from 'email-validator'
import { signJwt } from './jwtHelper.js'

/**
 * @param {string} identifier Can be username or email
 * @param {Object[]} users 
 * @returns {mongoose.Document}
 */
export const findUserByIdentifier = (identifier, users) => {
  if (!identifier)
    return null;

  const idUpper = identifier.toUpperCase();

  let fieldName = "username";
  if (emailValidator.validate(identifier))
    fieldName = "email";

  return users.find(user => user?.[fieldName]?.toUpperCase() === idUpper);
}

export const generateUserTokens = (user) => {
  const accessToken = signJwt({ type: "a", userId: user._id, username: user.username, email: user.email }, { expiresIn: "1m" });
  const refreshToken = signJwt({ type: "r", userId: user._id });

  return { accessToken, refreshToken };
}

/** @param {string} userId */
export const isValidUser = async (userId) => {
  if (!userId) return false;

  const user = await User.findById(userId);

  if (!user) return false;

  return true;
};