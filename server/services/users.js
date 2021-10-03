
import { Users } from "../models/user.js";

/** @param {string} userId */
export const isValidUser = async (userId) => {
  if (!userId) return false;

  const user = await Users.findById(userId);

  if (!user) return false;

  return true;
};