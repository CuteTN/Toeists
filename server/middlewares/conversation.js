import express from 'express'
import { getMemberInfoOfConversation } from '../services/conversation.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';
import { TARGETED_DATA_EXTRACTOR } from './findById.js';

/** @type {(conversationExtractor: ConversationExtractor, adminRequired: Boolean) => express.RequestHandler} */
export const checkIsMemberOfConversationMdwFn = (conversationExtractor = TARGETED_DATA_EXTRACTOR, adminRequired = false) =>
  async (req, res, next) => {
    const userId = req?.attached?.decodedToken?.userId;

    let conversation = null;

    try { conversation = conversationExtractor(req); }
    catch { }

    if (!conversation)
      return res.status(httpStatusCodes.internalServerError).json({ message: "Failed to extract conversation." })

    const memberInfo = getMemberInfoOfConversation(conversation, userId);

    if (!memberInfo)
      return res.status(httpStatusCodes.forbidden).json({ message: "You're not a member of this conversation." })

    if (adminRequired && (memberInfo.role !== "admin"))
      return res.status(httpStatusCodes.forbidden).json({ message: "You must be an admin to perform this action." })

    if (!req.attached) req.attached = {};
    req.attached.conversationMemberInfo = memberInfo;

    return next?.();
  }

/**
 * 
 * @param {"private" | "group"} type 
 * @param {ConversationExtractor} conversationExtractor 
 * @returns {express.RequestHandler}
 */
export const checkConversationTypeMdwFn = (type, conversationExtractor = TARGETED_DATA_EXTRACTOR) =>
  (req, res, next) => {
    const userId = req?.attached?.decodedToken?.user?._id;

    let conversation = null;

    try { conversation = conversationExtractor(req); }
    catch { }

    if (!conversation)
      return res.status(httpStatusCodes.internalServerError).json({ message: "Fail to extract conversation." })

    if (conversation.type !== type)
      return res.status(httpStatusCodes.unprocessableEntity).json({ message: `The conversation type must be ${type}.` });

    if (type === "private") {
      const partnerInfo = conversation.members.find?.(member => !member.memberId.equals(userId));

      if (!req.attached) req.attached = {};
      req.attached.conversationPartnerInfo = partnerInfo;
    }

    return next?.();
  }


/**
 * @typedef {(req: express.Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>) => Object} ConversationExtractor
 */