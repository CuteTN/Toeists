import express from 'express'
import { Conversation, CONVERSATION_VIRTUAL_FIELDS } from '../models/conversation.js';
import { User } from '../models/user.js';
import { getPrivateConversation, getMemberInfoOfConversation, upsertMemberOfConversation, removeMemberOfConversation, hideSensitiveConversationDataFromUser, notifyUpdatedConversations } from '../services/conversation.js';
import { findUserByIdentifier } from '../services/users.js';
import { CHECK_EQUALITY_DEFAULT, removeDuplication } from '../utils/arraySet.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** @type {express.RequestHandler} */
export const getConversationsOfUser = async (req, res, next) => {
  const allConversations = await Conversation.find()
    .select("+members.hasMuted +members.hasBlocked")
    .sort({ messageUpdatedAt: 'desc' })
    .populate({ path: "messages", options: { perDocumentLimit: 1 } })
    .populate({ path: "members.member" });

  const { userId } = req.attached.decodedToken;

  const conversationsOfUser = allConversations
    .filter(conversation => getMemberInfoOfConversation(conversation, userId))
    .map(conversation => hideSensitiveConversationDataFromUser(conversation, userId));

  return res.status(httpStatusCodes.ok).json(conversationsOfUser);
}


/** @type {express.RequestHandler} */
export const getConversationById = async (req, res, next) => {
  const { userId } = req.attached.decodedToken;
  const conversation = await Conversation
    .findById(req.params.id)
    .select("+members.hasMuted +members.hasBlocked")
    .populate({ path: "messages" })
    .populate({ path: "members.member" });

  return res.status(httpStatusCodes.ok).json(hideSensitiveConversationDataFromUser(conversation, userId));
}


/** @type {express.RequestHandler} */
export const getPrivateConversationByPartnerId = async (req, res, next) => {
  const currentUserId = req.attached.decodedToken.userId;
  const { partnerId } = req.params;

  if (currentUserId === partnerId)
    return res.status(httpStatusCodes.badRequest).json({ message: "The current user must be different from the partner ID." });

  const autoCreate = req.query["auto-create"] !== undefined && req.query["auto-create"] !== "false";
  let conversation = await getPrivateConversation(currentUserId, partnerId, autoCreate);

  if (!conversation)
    return res.status(httpStatusCodes.notFound).json({
      message: `The conversation of these users wasn't initialized. You can use "auto-create" query to instantiate it.`
    });

  return res.status(httpStatusCodes.ok).json(conversation);
}


/** @type {express.RequestHandler} */
export const createConversation = async (req, res, next) => {
  const newConversationDto = req.body;
  const creatorId = req.attached.decodedToken.userId;

  if (!Array.isArray(newConversationDto.memberIds))
    return res.status(httpStatusCodes.badRequest).json({ message: "memberIds is required and must be an array." });

  newConversationDto.memberIds.push(creatorId);

  // NOTE: CHECK_EQUALITY_DEFAULT because the list of member id here is actually a list of string...
  newConversationDto.members = removeDuplication(newConversationDto.memberIds, CHECK_EQUALITY_DEFAULT)
    .map(memberId => ({
      memberId,
      role: (creatorId === memberId) && (newConversationDto.type === "group") ? "admin" : "none",
    }))

  delete newConversationDto.memberIds;

  try {
    const createdConversation = await Conversation.create(newConversationDto);
    await createdConversation.populate?.(CONVERSATION_VIRTUAL_FIELDS);

    notifyUpdatedConversations(createdConversation);
    return res.status(httpStatusCodes.ok).json(createdConversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while creating new conversation.", error });
  }
}


/** @type {express.RequestHandler} */
export const removeGroupConversation = async (req, res, next) => {
  const conversationId = req.params.id;

  try {
    const conversation = req.attached?.targetedData;
    await Conversation.findByIdAndDelete(conversationId);

    notifyUpdatedConversations(conversation);
    return res.sendStatus(httpStatusCodes.ok);
  }
  catch {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while removing conversation." });
  }
}


/** @type {express.RequestHandler} */
export const updateConversation = async (req, res, next) => {
  const existingConversation = req.attached.targetedData;
  const conversationToUpdate = req.body;
  const conversationId = req.params.id;

  delete conversationToUpdate.members;
  conversationToUpdate.type = existingConversation.type;

  conversationToUpdate.name = conversationToUpdate.name?.trim?.();
  if (conversationToUpdate.type === "group" && !conversationToUpdate.name)
    return res.status(httpStatusCodes.badRequest).json({ message: "A group conversation must have a name." });

  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, conversationToUpdate, { new: true, runValidators: true });

    notifyUpdatedConversations(updatedConversation);
    return res.status(httpStatusCodes.ok).json(updatedConversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while updating the conversation.", error });
  }
}


/** @type {express.RequestHandler} */
export const upsertMembersToGroupConversation = async (req, res, next) => {
  // NOTE: It's not neccessary to populate data here
  const conversation = req.attached?.targetedData;
  const memberIdsToAdd = req.body.memberIds;

  if (!Array.isArray(memberIdsToAdd))
    return res.sendStatus(httpStatusCodes.badRequest).json({ message: "memberIds is required and must be an array." });

  memberIdsToAdd.forEach(memberId => upsertMemberOfConversation(conversation, memberId))

  try {
    await conversation.save?.();
    notifyUpdatedConversations(conversation);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.unprocessableEntity).json({ message: "Error while adding members to the conversation", error })
  }
}


/** @type {express.RequestHandler} */
export const removeMembersFromGroupConversation = async (req, res, next) => {
  // NOTE: It's not neccessary to populate data here
  const conversation = req.attached?.targetedData;
  const initialMemberIds = conversation.members.map(({ memberId }) => memberId);
  const memberIdsToRemove = req.body.memberIds;

  if (!Array.isArray(memberIdsToRemove))
    return res.sendStatus(httpStatusCodes.badRequest).json({ message: "memberIds is required and must be an array." });

  memberIdsToRemove.forEach(memberId => removeMemberOfConversation(conversation, memberId))
  try {
    await conversation.save?.();

    notifyUpdatedConversations(conversation, initialMemberIds);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.unprocessableEntity).json({ message: "Error while removing members from the conversation", error })
  }
}


/** @type {express.RequestHandler} */
export const setMembersOfGroupConversation = async (req, res, next) => {
  // NOTE: It's not neccessary to populate data here
  const { userId } = req.attached.decodedToken ?? {};
  const conversation = req.attached?.targetedData;
  const oldMemberIds = conversation.members.map(({ memberId }) => memberId.toString());

  if (!Array.isArray(req.body.memberIds))
    return res.sendStatus(httpStatusCodes.badRequest).json({ message: "memberIds is required and must be an array." });

  const newMemberIds = [...req.body.memberIds, userId];
  const allMemberIds = removeDuplication([...oldMemberIds, ...newMemberIds]);
  
  allMemberIds.forEach(memberId => {
    const isInOld = oldMemberIds.includes(memberId);
    const isInNew = newMemberIds.includes(memberId);

    if(isInOld && !isInNew)
      removeMemberOfConversation(conversation, memberId);
    if(isInNew && !isInOld)
      upsertMemberOfConversation(conversation, memberId);
  });

  try {
    await conversation.save?.();

    notifyUpdatedConversations(conversation, allMemberIds);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.unprocessableEntity).json({ message: "Error while removing members from the conversation", error })
  }
}


/** @type {express.RequestHandler} */
export const setMemberRolesOfGroupConversation = async (req, res, next) => {
  const conversation = req.attached?.targetedData;
  const allUser = await User.find();
  const { members } = req.body;

  if (!Array.isArray(members))
    return res.sendStatus(httpStatusCodes.badRequest).json({ message: "members is required and must be an array." });

  for (let i = 0; i < members.length; i++) {
    const userIdentifier = members[i].memberId;
    const role = members[i].role;

    if (!(role && userIdentifier))
      return res.status(httpStatusCodes.badRequest).json({ message: "memberId and role fields are required for each element of members array." });

    const user = findUserByIdentifier(userIdentifier, allUser);
    if (!user)
      return res.status(httpStatusCodes.notFound).json({ message: `Unrecognized user: ${members[i].memberId}` });

    const memberInfo = getMemberInfoOfConversation(conversation, user.id);
    if (memberInfo)
      memberInfo.role = role;
    else
      return res.status(httpStatusCodes.badRequest).json({ message: `User ${userIdentifier} is not a member of this conversation.`})
  }

  try {
    await conversation.save?.();

    notifyUpdatedConversations(conversation);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.unprocessableEntity).json({ message: "Error while updating roles of members in the conversation", error })
  }
}


/**
 * @param {string} field 
 * @param {(req: express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>) => any} valueExtractor This can also be a value
 * @returns {express.RequestHandler};
 */
const setMyMemberInfoFn = (field, valueExtractor) => async (req, res, next) => {
  const memberInfo = req?.attached?.conversationMemberInfo;
  const conversation = req?.attached?.targetedData;

  try {
    var newValue = typeof valueExtractor === "function" ?
      valueExtractor(req)
      :
      valueExtractor;
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while extracting data to update.", error });
  }

  try {
    memberInfo[field] = newValue;
    await conversation.save();

    notifyUpdatedConversations(conversation);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while updating the conversation member info.", error })
  }
}

export const setMyNicknameInConversation = setMyMemberInfoFn("nickname", req => req.body.nickname);

export const setMyMutedStateConversation = setMyMemberInfoFn("hasMuted", req => {
  const { value } = req.body;
  if (value === undefined)
    throw "The field 'value' is required."
  if (typeof value !== "boolean")
    throw "The field 'value' must have type boolean."
  return value;
});

export const setMySeenStateConversation = setMyMemberInfoFn("hasSeen", req => {
  const { value } = req.body;
  if (value === undefined)
    throw "The field 'value' is required."
  if (typeof value !== "boolean")
    throw "The field 'value' must have type boolean."
  return value;
});

export const setMyBlockedStateConversation = setMyMemberInfoFn("hasBlocked", req => {
  const { value } = req.body;
  if (value === undefined)
    throw "The field 'value' is required."
  if (typeof value !== "boolean")
    throw "The field 'value' must have type boolean."
  return value;
});

export const leaveConversation = async (req, res, next) => {
  const conversation = req.attached?.targetedData;
  const memberIdToRemove = req.attached.decodedToken.userId;
  const initialMemberIds = conversation.members.map(({ memberId }) => memberId);
  removeMemberOfConversation(conversation, memberIdToRemove)

  try {
    await conversation.save?.();
    notifyUpdatedConversations(conversation, initialMemberIds);
    return res.status(httpStatusCodes.ok).json(conversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.unprocessableEntity).json({ message: "Error while removing a member from the conversation", error })
  }
}