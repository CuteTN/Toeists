import express from 'express'
import { SearchRecord } from '../models/searchRecord.js';
import { User, USER_VIRTUAL_FIELDS } from '../models/user.js';
import { UserConnection } from '../models/userConnection.js';
import { getUserMatchPoint } from '../services/search/searchUser.js';
import { checkUserHasConnectionWith } from '../services/userConnection.js';
import { customPagination } from '../utils/customPagination.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';

const USER_DEFAULT_PAGESIZE = 5;

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
    searchQuery.pageSize = searchQuery.pageSize ?? USER_DEFAULT_PAGESIZE;

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
const searchForForums = async (req, res, next) => {
}
