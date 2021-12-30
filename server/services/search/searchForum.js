import { getMatchPoint } from "../../utils/matchString.js";
import { getUserMatchPoint } from "./searchUser.js";

const TITLE_FACTOR = 100;
const CONTENT_FACTOR = 10;
const CREATOR_FACTOR = 1;

export const getForumMatchPoint = (query, forum) => {
  /** @type {string} */
  const searchText = query.text ?? "";
  
  let result = 0;

  result = 
    getMatchPoint(searchText, forum?.title) * TITLE_FACTOR +
    getMatchPoint(searchText, forum?.content) * CONTENT_FACTOR;

  if (forum?.creator)
    result += Math.floor(getUserMatchPoint(query, forum?.creator) / 100) * CREATOR_FACTOR;

  if (query?.hashtags) {
    forum?.hashtags?.forEach(ht => {
      result += Math.max(0, getMatchPoint(searchText, ht?.name));
    })
  }

  return result;
}