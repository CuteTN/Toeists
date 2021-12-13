import { User } from "../models/user.js";
import mongoose from "mongoose";
import emailValidator from 'email-validator'
import { signJwt } from './jwtHelper.js'
import { clientUrl } from "../index.js";


/**
 * @param {string} identifier Can be username or email
 * @param {Object[]} users 
 * @returns {mongoose.Document}
 */
export const findUserByIdentifier = (identifier, users) => {
  if (!identifier)
    return null;

  if (mongoose.isValidObjectId(identifier))
    return users.find(user => user?._id?.equals(identifier));

  const idUpper = identifier.toUpperCase();

  let fieldName = "username";
  if (emailValidator.validate(identifier))
    fieldName = "email";

    return users.find(user => user?.[fieldName]?.toUpperCase() === idUpper);
}

export const generateUserTokens = (user, expiresIn) => {
  const accessToken = signJwt(
    { type: "a", userId: user._id, username: user.username, email: user.email },
    // BUGGY: Cannot handle socket IO 
    // { expiresIn: expiresIn ?? "10m" }
  );
  const refreshToken = signJwt({ type: "r", userId: user._id });

  return { accessToken, refreshToken };
}

export const generateEmailConfirmationUrl = (userId, confirmationType, additionalPayload, tokenExpiresIn) => {
  const confirmationToken = signJwt(
    {
      ...(additionalPayload ?? {}),
      type: confirmationType,
      userId,
    },
    { expiresIn: tokenExpiresIn, }
  )
  const confirmationUrl = `${clientUrl}/email-confirmation/${confirmationToken}`;

  return {
    confirmationToken,
    confirmationUrl,
  }
}

/** @param {string} userId */
export const isValidUser = async (userId) => {
  if (!userId) return false;

  const user = await User.findById(userId);

  if (!user) return false;

  return true;
};