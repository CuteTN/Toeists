import { Users } from "../models/user.js"
import express from 'express'
import { httpStatusCodes } from "../utils/httpStatusCode.js";

/**
 * @param {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {express.NextFunction} next
 */
export const getAllUsers = async (req, res, next) => {
  const users = await Users.find();
  return res.status(httpStatusCodes.ok).send(users);
}

/**
 * @param {express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {express.NextFunction} next
 */
export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findById(id);

  if(!user)
    return res.status(httpStatusCodes.notFound).send("User not found");

  return res.status(httpStatusCodes.ok).send(user);
}