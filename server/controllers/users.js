import { User } from "../models/user.js"
import express from 'express'
import { httpStatusCodes } from "../utils/httpStatusCode.js";

/** @type {express.RequestHandler} */
export const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  return res.status(httpStatusCodes.ok).send(users);
}

/** @type {express.RequestHandler} */
export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if(!user)
    return res.status(httpStatusCodes.notFound).send("User not found");

  return res.status(httpStatusCodes.ok).send(user);
}