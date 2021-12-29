import { getMatchPoint } from "../../utils/matchString.js";

export const getUserMatchPoint = (query, user) => {
  /** @type {string} */
  const searchText = query.text ?? "";
  
  let result = 0;

  result = Math.max(
    getMatchPoint(searchText, user?.username),
    getMatchPoint(searchText, user?.email),
    getMatchPoint(searchText, user?.name),
    getMatchPoint(searchText, user?.phoneNumber)
  ) * 100;

  if (query?.hashtags) {
    user?.hashtags?.forEach(ht => {
      result += Math.max(0, getMatchPoint(searchText, ht?.name));
    })
  }

  return result;
}