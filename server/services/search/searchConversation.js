import { getMatchPoint } from "../../utils/matchString.js";
import { getUserMatchPoint } from "./searchUser.js";

const NAME_FACTOR = 10;
const USER_FACTOR = 1;

export const getConversationMatchPoint = (query, conversation) => {
  /** @type {string} */
  const searchText = query.text ?? "";

  let result = 0;

  result = getMatchPoint(searchText, conversation?.name) * NAME_FACTOR;

  if (Array.isArray(conversation?.members)) {
    conversation.members.forEach(({ member }) => {
      result += getUserMatchPoint(query, member) * USER_FACTOR;
    })
  }

  return result;
}