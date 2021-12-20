import mongoose from "mongoose";
import { Conversation } from "../models/conversation.js";
import { Message } from "../models/message.js";
import { httpStatusCodes } from "../utils/httpStatusCode.js";
import { cuteIO } from './../index.js'

/**
 * @param {*} user1Id 
 * @param {*} user2Id 
 * @param {boolean} autoCreate Auto create a new conversation of 2 users if it doesn't exist
 * @returns 
 */
export const getPrivateConversation = async (user1Id, user2Id, autoCreate = false) => {
  let result = (await Conversation.find({ type: "private" }))
    .find(conversation =>
      getMemberInfoOfConversation(conversation, user1Id)
      &&
      getMemberInfoOfConversation(conversation, user2Id)
    )

  if (autoCreate && !result) {
    result = await Conversation.create({
      members: [user1Id, user2Id].map(memberId => ({ memberId })),
      type: "private",
    })
  }

  return result;
}


/**
 * @param {*} conversation 
 * @param {string[]?} toUserIds if this is not set, the list of members would be applied
 * @param {*} additionalData 
 */
export const notifyUpdatedConversations = (conversation, toUserIds, additionalData) => {
  try {
    if (!Array.isArray(toUserIds))
      toUserIds = conversation.members.map(({ memberId }) => memberId);

    toUserIds.forEach(userId => {
      cuteIO.sendToUser(userId.toString(), "Message-conversationsUpdated", additionalData ?? {});
    })
  }
  catch { }
}


/**
 * @returns return null if the user themselves is not a member of conversation
 */
export const getMemberInfoOfConversation = (conversation, userId) => {
  try { var _userId = new mongoose.Types.ObjectId(userId); }
  catch { return null; }
  return conversation?.members?.find(member => _userId.equals(member.memberId));
}


/**
 * @param {*} conversation 
 * @param {string} userId 
 */
export const upsertMemberOfConversation = (conversation, userId) => {
  try { var _userId = new mongoose.Types.ObjectId(userId); }
  catch { return }

  if (!getMemberInfoOfConversation(conversation, userId))
    if (Array.isArray(conversation.members))
      conversation.members.push({
        memberId: _userId,
      })
}


export const removeMemberOfConversation = (conversation, userId) => {
  try { var _userId = new mongoose.Types.ObjectId(userId); }
  catch { return }

  const memberIndex = conversation?.members?.findIndex(member => _userId.equals(member?.memberId)) ?? -1;
  if (memberIndex < 0)
    return;

  conversation.members.splice(memberIndex, 1);
}


/**
 * WARN: This function will return a conversation as POJO, only use this before responding to client 
 * @param {*} conversation 
 * @param {*} userId 
 * @returns 
 */
export const hideSensitiveConversationDataFromUser = (conversation, userId) => {
  if (!(conversation?.members && userId))
    return;
  const conversationObj = conversation.toObject?.();
  if (!conversationObj)
    return;

  const _userId = new mongoose.Types.ObjectId(userId);
  conversationObj.members.forEach(member => {
    if (!_userId.equals(member.memberId)) {
      delete member.hasMuted;
      delete member.hasBlocked;
    }
  });

  return conversationObj;
}

/**
 * @param {mongoose.Types.ObjectId | string} userId
 * @param {mongoose.Types.ObjectId | string} conversationId
 * @param {{ text: string, senderId }} message
 * @returns {Promise<MessageEventResult>}
 */
export const addMessageToConversation = async (userId, conversationId, message) => {
  const res = { userId, conversationId, message, };

  if (!userId) {
    return {
      status: {
        code: httpStatusCodes.unauthorized,
        msg: "Unauthorized.",
      },
      res,
    };
  }
  if (!message) {
    return {
      status: {
        code: httpStatusCodes.badContent,
        msg: "A message is required.",
      },
      res,
    };
  }

  const conversation = conversationId ? await Conversation.findById(conversationId) : null;

  if (!conversation) {
    // return res.status(httpStatusCodes.notFound).send();
    return {
      status: {
        code: httpStatusCodes.notFound,
        msg: `There's no conversation with id ${conversationId}`,
      },
      res,
    };
  }

  if (!getMemberInfoOfConversation(conversation, userId)) {
    return {
      status: {
        code: httpStatusCodes.forbidden,
        msg: "Not a member of conversation",
      },
      res,
    };
  }

  message.senderId = userId;
  message.conversationId = conversationId;

  try {
    var createdMessage = await Message.create(message);
  } catch (error) {
    return {
      status: {
        code: httpStatusCodes.internalServerError,
        msg: error,
      },
      res,
    };
  }

  // Update conversation
  conversation.messageUpdatedAt = Date.now();
  conversation.members?.forEach(member => { member.hasSeen = member.memberId.equals(userId); });
  await conversation.save();

  return {
    status: {
      code: httpStatusCodes.ok,
    },
    res: {
      senderId: userId,
      conversationId,
      message: createdMessage,
      receiverIds: conversation.members.map(m => m.memberId.toString()),
    },
  };
};


/**
 * @typedef {{status: {code: string, msg: any}, res: {senderId: string, conversationId: string, message: any, receiverIds: string, seenValue: boolean, listSeenMembers: [string]}}} MessageEventResult
 */

/**
 * @typedef {mongoose.LeanDocument<mongoose.Document<any,{}>} POJO
 */
