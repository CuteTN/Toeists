import bcrypt from "bcryptjs";
import { User, USER_VIRTUAL_FIELDS } from "../models/user.js";
import { RefreshToken } from '../models/refreshToken.js';
import express from "express";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import mongoose from "mongoose";
import { UserConnection } from "../models/userConnection.js";
import { checkUserHasConnectionWith, getAllConnectionsOfUser } from "../services/userConnection.js";
import { findUserByIdentifier, generateEmailConfirmationUrl, generateUserTokens } from "../services/users.js";
import { verifyJwt } from "../services/jwtHelper.js";
import { smtpTransport } from "../index.js";
import { CHECK_EQUALITY_DEFAULT, removeDuplication } from "../utils/arraySet.js";
import { findExistingHashtags, reduceHashtagPreferences, upsertHashtagPreferences } from "../services/hashtag.js";

/** @type {express.RequestHandler} */
export const createUser = async (req, res, next) => {
  const newUserDto = { ...req.body };
  if (!newUserDto.password)
    return res.status(httpStatusCodes.badRequest).json({ message: "Password is required!" });

  const hashedPassword = await bcrypt.hash(newUserDto.password, 12);
  newUserDto.hashedPassword = hashedPassword;
  delete newUserDto.password;

  // DIRTY: Should set this thing to false, but for now, it's all about the convenience in testing
  newUserDto.isActivated = true;

  // if the user email was already used for another INACTIVATED user, just delete that user right away
  const existingUser = await User.findOne({ email: newUserDto.email });
  if (existingUser && !existingUser.isActivated)
    await User.findByIdAndDelete(existingUser._id);

  let hashtagNames = [];

  if (Array.isArray(newUserDto.hashtagNames)) {
    hashtagNames = removeDuplication(newUserDto.hashtagNames, CHECK_EQUALITY_DEFAULT);
    await upsertHashtagPreferences(hashtagNames);
    newUserDto.hashtagIds = (await findExistingHashtags(hashtagNames)).map(ht => ht._id);
  }
  else {
    newUserDto.hashtagIds = [];
  }

  /** @type {mongoose.Document} */
  const newUser = new User(newUserDto);

  try { await newUser.validate(); }
  catch (error) {
    await reduceHashtagPreferences(hashtagNames);
    return res.status(httpStatusCodes.badRequest).json(error)
  }

  await newUser.save();
  await newUser.populate(USER_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(newUser);
}


/** @type {express.RequestHandler} */
export const signIn = async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier)
    return res.status(httpStatusCodes.badRequest).json({ message: "Identifier is required." });
  if (!password)
    return res.status(httpStatusCodes.badRequest).json({ message: "Password is required." });

  const allUsers = await User.find().select("+hashedPassword");
  const user = findUserByIdentifier(identifier, allUsers);

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: `User ${identifier} does not exist.` })
  if (!user.isActivated)
    return res.status(httpStatusCodes.forbidden).json({ message: `User ${identifier} has not activated their account.` })

  const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordCorrect)
    return res.status(httpStatusCodes.badRequest).json({ message: "Wrong password." });

  const noRefresh = req.query["no-refresh"] !== undefined && req.query["no-refresh"] !== "false";

  const tokens = generateUserTokens(user, noRefresh ? "24h" : null);

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
  if (!user.isActivated)
    return res.status(httpStatusCodes.forbidden).json({ message: `The owner of the token has not activated their account.` })

  if (!refreshTokenDoc)
    return res.status(httpStatusCodes.badRequest).json({ message: "Invalid token (not in white-list)" });

  const tokens = generateUserTokens(user);
  await RefreshToken.findByIdAndUpdate(refreshTokenDoc._id, { token: tokens.refreshToken }, { runValidators: true });

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


/** @type {express.RequestHandler} */
export const requestAccountActivation = async (req, res, next) => {
  let userId = req.params.id;

  if (!userId)
    return res.status(httpStatusCodes.badRequest).json({ message: "A user ID is required." });

  const allUsers = await User.find();
  const user = findUserByIdentifier(userId, allUsers);

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: "User does not exist." });
  if (user.isActivated)
    return res.status(httpStatusCodes.badRequest).json({ message: "The user has already activated." });

  userId = user._id;

  const { confirmationUrl } = generateEmailConfirmationUrl(userId, "AccountActivation", null, "30m");

  try {
    await smtpTransport.sendMail({
      to: user.email,
      subject: "Activate your account!",
      html: `
      <h1>Hello ${user.name}!</h1>
      <p>Welcome to Toeists and thanks for joining our community!</p>
      <p>Before getting on with our services, please <b>activate your account</b> by simply clicking <a href="${confirmationUrl}">this link</a>!</p>
      <em>NOTE: This activation link would only be available for 30 minutes. After this time, your registration would be canceled.</em>
      <br> <br>
      <b>Enjoy and best regards!<b>
      <br>
      <b>TOEISTS TEAM<b>
      `
    })

    return res.sendStatus(httpStatusCodes.accepted);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({
      message: "Couldn't send confirmation email.",
      error
    })
  }
}


/** @type {express.RequestHandler} */
export const verifyAccountActivation = async (req, res, next) => {
  let userId = req.params.id;

  if (!userId)
    return res.status(httpStatusCodes.badRequest).json({ message: "A user ID is required." });

  const allUsers = await User.find();
  const user = findUserByIdentifier(userId, allUsers);

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: "User does not exist." });
  if (user.isActivated)
    return res.status(httpStatusCodes.badRequest).json({ message: "The user has already activated." });

  userId = user._id;

  const { activateAccountToken } = req.body;
  const decodedToken = verifyJwt(activateAccountToken);

  const isValidAccountActivationToken =
    decodedToken.isValid &&
    userId.equals(decodedToken.payload?.userId) &&
    decodedToken.payload?.type === "AccountActivation";

  if (!isValidAccountActivationToken)
    return res.status(httpStatusCodes.badRequest).json({ message: "The provided token is not valid." });

  try {
    await User.findByIdAndUpdate(user._id, { isActivated: true }, { runValidators: true });
  }
  catch {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error occurs while updating user." })
  }

  return res.sendStatus(httpStatusCodes.ok);
}


/** @type {express.RequestHandler} */
export const requestPasswordReset = async (req, res, next) => {
  let userId = req.params.id;

  if (!userId)
    return res.status(httpStatusCodes.badRequest).json({ message: "A user ID is required." });

  const allUsers = await User.find();
  const user = findUserByIdentifier(userId, allUsers);

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: "User does not exist." });
  if (!user.isActivated)
    return res.status(httpStatusCodes.forbidden).json({ message: "The user has not activated their account." })

  userId = user._id;

  const { confirmationUrl } = generateEmailConfirmationUrl(userId, "PasswordReset", null, "5m");

  try {
    await smtpTransport.sendMail({
      to: user.email,
      subject: "Confirm to reset your password!",
      html: `
      <h1>Hello ${user.name}!</h1>
      <p>Your request to reset password has been received.</p>
      <p>To continue the process, please <b>confirm your request</b> by simply clicking <a href="${confirmationUrl}">this link</a>!</p>
      <em>NOTE: This confirmation link would only be available for 5 minutes. After this time, your request would be canceled.</em> 
      <br> <br>
      <b>Enjoy and best regards!<b>
      <br>
      <b>TOEISTS TEAM<b>
      `
    })

    return res.sendStatus(httpStatusCodes.accepted);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({
      message: "Couldn't send confirmation email.",
      error
    })
  }
}


/** @type {express.RequestHandler} */
export const getAllUsers = async (req, res, next) => {
  const users = await User.find().populate(USER_VIRTUAL_FIELDS);
  const signedInUserId = req.attached.decodedToken.userId;

  const blockingConnections = await UserConnection.find({ status: "blocking", });
  let visibleUsers = users.filter(u =>
    !(
      checkUserHasConnectionWith(signedInUserId, u._id, blockingConnections, "blocking") ||
      checkUserHasConnectionWith(u._id, signedInUserId, blockingConnections, "blocking")
    )
  );

  return res.status(httpStatusCodes.ok).json(visibleUsers);
};


/** @type {express.RequestHandler} */
export const getUserById = async (req, res, next) => {
  const user = req?.attached?.targetedData;
  await user.populate(USER_VIRTUAL_FIELDS);

  return res.status(httpStatusCodes.ok).json(user);
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
  delete updatingData.isActivated;

  if (!mongoose.isValidObjectId(id))
    return res
      .status(httpStatusCodes.badRequest)
      .json({ message: "Invalid ID." });

  const existedUser = await User.findById(id).populate(USER_VIRTUAL_FIELDS);
  if (!existedUser) return res.sendStatus(httpStatusCodes.notFound);

  const flagUpdateHashtags = Array.isArray(updatingData.hashtagNames);
  let oldHashtagNames = [];
  let newHashtagNames = [];

  if (flagUpdateHashtags) {
    oldHashtagNames = existedUser.hashtags.map(ht => ht.name);
    await reduceHashtagPreferences(oldHashtagNames);

    newHashtagNames = removeDuplication(updatingData.hashtagNames, CHECK_EQUALITY_DEFAULT);
    await upsertHashtagPreferences(newHashtagNames);
    updatingData.hashtagIds = (await findExistingHashtags(newHashtagNames)).map(ht => ht._id);
  }

  try {
    var updatedUser = await User
      .findByIdAndUpdate(id, updatingData, {
        new: true,
        runValidators: true,
      })
      .populate(USER_VIRTUAL_FIELDS);
  } catch (error) {
    // revert hashtag update
    if (flagUpdateHashtags) {
      await upsertHashtagPreferences(oldHashtagNames);
      await reduceHashtagPreferences(newHashtagNames);
    }

    return res.status(httpStatusCodes.badRequest).json(error);
  }

  return res.status(httpStatusCodes.ok).json(updatedUser);
};


/** @type {express.RequestHandler} */
export const updateUserPassword = async (req, res, next) => {
  const { currentPassword, newPassword, resetPasswordToken } = req.body ?? {};

  if (!newPassword)
    return res.status(httpStatusCodes.badRequest).json({ message: "A new password is required." });

  if ((!currentPassword) && (!resetPasswordToken))
    return res.status(httpStatusCodes.badRequest).json({ message: "The current password or an reset password must be provided." })

  let userId = req.params.id;

  if (!userId)
    return res.status(httpStatusCodes.badRequest).json({ message: "A user ID is required." });

  const allUsers = await User.find().select("+hashedPassword");
  const user = findUserByIdentifier(userId, allUsers);

  if (await bcrypt.compare(newPassword, user.hashedPassword))
    return res.status(httpStatusCodes.badRequest).json({ message: "The new password must be different from the previous one." })

  if (!user)
    return res.status(httpStatusCodes.notFound).json({ message: "User does not exist." });
  if (!user.isActivated)
    return res.status(httpStatusCodes.forbidden).json({ message: "The user has not activated their account." })

  userId = user._id;

  let canChange = false;

  if (currentPassword) {
    canChange = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!canChange)
      return res.status(httpStatusCodes.unauthorized).json({ message: "The provided password is not correct." });
  }
  else {
    const decodedToken = verifyJwt(resetPasswordToken);

    canChange =
      decodedToken.isValid &&
      userId.equals(decodedToken.payload?.userId) &&
      decodedToken.payload?.type === "PasswordReset";

    if (!canChange)
      return res.status(httpStatusCodes.unauthorized).json({ message: "The provided token is invalid." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  if (canChange) {
    try {
      await User.findByIdAndUpdate(userId, { hashedPassword }, { runValidators: true })
    }
    catch {
      return res.status(httpStatusCodes.internalServerError).json({ message: "An error occured when updating data." });
    }
  }

  return res.sendStatus(httpStatusCodes.ok);
}