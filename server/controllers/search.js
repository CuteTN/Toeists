import express from 'express'
import { SearchRecord } from '../models/searchRecord.js';
import { Forum, FORUM_VIRTUAL_FIELDS } from '../models/forum.js';
import { User, USER_VIRTUAL_FIELDS } from '../models/user.js';
import { UserConnection } from '../models/userConnection.js';
import { getUserMatchPoint } from '../services/search/searchUser.js';
import { checkUserHasConnectionWith } from '../services/userConnection.js';
import { customPagination } from '../utils/customPagination.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';
import { checkIsForumVisibleByUser } from '../services/forum.js';
import { getForumMatchPoint } from '../services/search/searchForum.js';
import { Conversation } from '../models/conversation.js';
import { getMemberInfoOfConversation, hideSensitiveConversationDataFromUser } from '../services/conversation.js';
import { getConversationMatchPoint } from '../services/search/searchConversation.js';

const USER_DEFAULT_PAGESIZE = 5;
const FORUM_DEFAULT_PAGESIZE = 5;
const CONVERSATION_DEFAULT_PAGESIZE = 5;

/**
 * Wrap up, add count, paginate and more? 
 * @param {*} query 
 * @param {object[]} data
 */
const createSearchResult = (query, data) => {
  return {
    query,
    count: data.length,
    data: customPagination(data ?? [], query.pageSize, query.page),
  };
}

/** @type {express.RequestHandler} */
export const searchForUsers = async (req, res, next) => {
  try {
    const signedInUserId = req?.attached?.decodedToken?.userId

    const noSave = req.query["no-save"] !== undefined && req.query["no-save"] !== "false";
    const allUsers = await User.find().populate(USER_VIRTUAL_FIELDS);
    const blockingConnections = await UserConnection.find({ status: "blocking", });

    let visibleUsers = allUsers.filter(u =>
      !(
        checkUserHasConnectionWith(signedInUserId, u._id, blockingConnections, "blocking") ||
        checkUserHasConnectionWith(u._id, signedInUserId, blockingConnections, "blocking")
      )
    );

    const searchQuery = req.body ?? {};
    if (!searchQuery.text)
      return res.status(httpStatusCodes.badRequest).json({ message: "The search query must include the text field." });
    searchQuery.pageSize = searchQuery.pageSize || USER_DEFAULT_PAGESIZE;

    try {
      var searchRecord = new SearchRecord({
        userId: signedInUserId,
        category: "users",
        query: searchQuery,
      })

      await searchRecord.validate();
      if (!noSave)
        await searchRecord.save();
    }
    catch {
      return res.status(httpStatusCodes.badRequest).json({ message: "Error when creating a new search record." });
    }

    const matchPoints = {};
    visibleUsers.forEach(u => matchPoints[u._id.toString()] = getUserMatchPoint(searchQuery, u));
    visibleUsers = visibleUsers.filter(u => matchPoints[u._id.toString()] > 0);
    visibleUsers.sort((a, b) => matchPoints[b._id.toString()] - matchPoints[a._id.toString()]);

    return res.status(httpStatusCodes.ok).json(createSearchResult(searchRecord.query, visibleUsers));
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Something went wrong.", error });
  }
}

/** @type {express.RequestHandler} */
export const searchForForums = async (req, res, next) => {
  try {
    const signedInUserId = req?.attached?.decodedToken?.userId

    const noSave = req.query["no-save"] !== undefined && req.query["no-save"] !== "false";
    const allForums = await Forum.find().populate(FORUM_VIRTUAL_FIELDS);

    let visibleForums = allForums.filter(f => checkIsForumVisibleByUser(f, signedInUserId));

    const searchQuery = req.body ?? {};
    if (!searchQuery.text)
      return res.status(httpStatusCodes.badRequest).json({ message: "The search query must include the text field." });
    searchQuery.pageSize = searchQuery.pageSize || FORUM_DEFAULT_PAGESIZE;

    try {
      var searchRecord = new SearchRecord({
        userId: signedInUserId,
        category: "forums",
        query: searchQuery,
      })

      await searchRecord.validate();
      if (!noSave)
        await searchRecord.save();
    }
    catch {
      return res.status(httpStatusCodes.badRequest).json({ message: "Error when creating a new search record." });
    }

    const matchPoints = {};
    visibleForums.forEach(u => matchPoints[u._id.toString()] = getForumMatchPoint(searchQuery, u));
    visibleForums = visibleForums.filter(u => matchPoints[u._id.toString()] > 0);
    visibleForums.sort((a, b) => matchPoints[b._id.toString()] - matchPoints[a._id.toString()]);

    return res.status(httpStatusCodes.ok).json(createSearchResult(searchRecord.query, visibleForums));
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Something went wrong.", error });
  }
}


/** @type {express.RequestHandler} */
export const searchForConversations = async (req, res, next) => {
  try {
    const signedInUserId = req?.attached?.decodedToken?.userId

    const noSave = req.query["no-save"] !== undefined && req.query["no-save"] !== "false";
    const allConversations = await Conversation.find()
      .select("+members.hasMuted +members.hasBlocked")
      .sort({ messageUpdatedAt: 'desc' })
      .populate({ path: "messages", options: { perDocumentLimit: 1 } })
      .populate({ path: "members.member" });

    let visibleConversations = allConversations
      .filter(conversation => getMemberInfoOfConversation(conversation, signedInUserId))
      .map(conversation => hideSensitiveConversationDataFromUser(conversation, signedInUserId));

    const searchQuery = req.body ?? {};
    if (!searchQuery.text)
      return res.status(httpStatusCodes.badRequest).json({ message: "The search query must include the text field." });
    searchQuery.pageSize = searchQuery.pageSize || CONVERSATION_DEFAULT_PAGESIZE;

    try {
      var searchRecord = new SearchRecord({
        userId: signedInUserId,
        category: "conversations",
        query: searchQuery,
      })

      await searchRecord.validate();
      if (!noSave)
        await searchRecord.save();
    }
    catch {
      return res.status(httpStatusCodes.badRequest).json({ message: "Error when creating a new search record." });
    }

    const matchPoints = {};
    visibleConversations.forEach(u => matchPoints[u._id.toString()] = getConversationMatchPoint(searchQuery, u));
    visibleConversations = visibleConversations.filter(u => matchPoints[u._id.toString()] > 0);
    visibleConversations.sort((a, b) => matchPoints[b._id.toString()] - matchPoints[a._id.toString()]);

    return res.status(httpStatusCodes.ok).json(createSearchResult(searchRecord.query, visibleConversations));
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Something went wrong.", error });
  }
}