import express from 'express'
import { Conversation, CONVERSATION_VIRTUAL_FIELDS } from '../models/conversation.js';
import { getPrivateConversation, getMemberInfoOfConversation } from '../services/conversation.js';
import { CHECK_EQUALITY_DEFAULT, removeDuplication } from '../utils/arraySet.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** @type {express.RequestHandler} */
export const getConversationsOfUser = async (req, res, next) => {
  const allConversations = await Conversation.find().populate(CONVERSATION_VIRTUAL_FIELDS);
  const { userId } = req.attached.decodedToken;

  const conversationsOfUser = allConversations.filter(
    conversation => getMemberInfoOfConversation(conversation, userId)
  );

  return res.status(httpStatusCodes.ok).json(conversationsOfUser);
}


/** @type {express.RequestHandler} */
export const getConversationById = async (req, res, next) => {
  const conversation = req.attached.targetedData;
  await conversation.populate?.(CONVERSATION_VIRTUAL_FIELDS);

  return res.status(httpStatusCodes.ok).json(conversation);
}


/** @type {express.RequestHandler} */
export const getPrivateConversationByPartnerId = async (req, res, next) => {
  const currentUserId = req.attached.decodedToken.userId;
  const {partnerId} = req.params;

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

    return res.status(httpStatusCodes.ok).json(createdConversation);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while creating new conversation.", error });
  }
}