import mongoose from 'mongoose'
import { UserConnection } from '../models/userConnection.js'

/**
 * @param {string|mongoose.Types.ObjectId} userId 
 * @param {any[]} userConnections 
 * @returns {ConnectionOfUser}
 */
export const getAllConnectionsOfUser = (userId, userConnections) => {
  userId = mongoose.Types.ObjectId(userId);

  /** @type {ConnectionOfUser} */
  const result = {
    blockerIds: [],
    blockingUserIds: [],
    followerIds: [],
    followingUserIds: [],
    friendIds: [],
  }

  userConnections.forEach(uc => {
    if (userId.equals(uc.fromUserId)) {
      if (uc.status === "following") {
        result.followingUserIds.push(uc.toUserId);

        if(result.followerIds.find(id => id.equals(uc.toUserId)))
          result.friendIds.push(uc.toUserId);
      }
      if (uc.status === "blocking")
        result.blockingUserIds.push(uc.toUserId);
    }

    if (userId.equals(uc.toUserId)) {
      if(uc.status === "following") {
        result.followerIds.push(uc.fromUserId);
        
        if(result.followingUserIds.find(id => id.equals(uc.fromUserId)))
          result.friendIds.push(uc.fromUserId);
      }

      if(uc.status === "blocking")
        result.blockerIds.push(uc.fromUserId);
    }
  })

  return result;
}


/**
 * @param {string} fromUserId 
 * @param {string} toUserId 
 * @param {object[]} userConnections 
 * @param {"blocking" | "following"} status
 */
export const checkUserHasConnectionWith = (fromUserId, toUserId, userConnections, status) => {
  try {
    var _fromUserId = new mongoose.Types.ObjectId(fromUserId);
    var _toUserId = new mongoose.Types.ObjectId(toUserId);
  }
  catch { return false }

  return userConnections.some(uc =>
    _fromUserId.equals(uc.fromUserId) &&
    _toUserId.equals(uc.toUserId) &&
    uc.status === status
  )
}


/**
 * @param {string} fromUserId 
 * @param {string} toUserId 
 * @param {"blocking" | "following"} status
 */
export const checkUserHasConnectionWithAsync = async (fromUserId, toUserId, status) => {
  return await UserConnection.count({ fromUserId, toUserId, status }) > 0;
}



/**
 * @typedef {Object} ConnectionOfUser
 * @property {mongoose.Types.ObjectId[]} followingUserIds
 * @property {mongoose.Types.ObjectId[]} followerIds
 * @property {mongoose.Types.ObjectId[]} blockingUserIds
 * @property {mongoose.Types.ObjectId[]} blockerIds
 * @property {mongoose.Types.ObjectId[]} friendIds
 */