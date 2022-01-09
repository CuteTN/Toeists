import { getMatchPoint } from "../../utils/matchString.js";
import { getUserMatchPoint } from "./searchUser.js";

const NAME_FACTOR = 15;
const USER_FACTOR = 1;
const PRIVATE_CONVERSATION_FACTOR = 2;

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

  if (conversation?.type === "private")
    result *= PRIVATE_CONVERSATION_FACTOR;

  return result;
}