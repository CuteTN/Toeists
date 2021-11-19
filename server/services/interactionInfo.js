import mongoose from 'mongoose'
import { addToArraySet, CHECK_EQUALITY_MONGOOSE_ID, removeFromArrySet } from '../utils/arraySet.js';

/**
 * warning: multable function: mutates directly on the interaction info object
 * @param {any} interactionInfo 
 * @param {string} userId 
 * @param {InteractionInfoTypes} interactionType 
 */
export const alterInteractionInfo = (interactionInfo, userId, interactionType) => {
  const _userId = new mongoose.Types.ObjectId(userId);

  /**
   * @param {mongoose.Types.ObjectId[]} arr 
   * @param {mongoose.Types.ObjectId} id 
   */  
  const addId = (arr, id) =>
    addToArraySet(arr, id, CHECK_EQUALITY_MONGOOSE_ID);

  /**
   * @param {mongoose.Types.ObjectId[]} arr 
   * @param {mongoose.Types.ObjectId} id 
   */  
  const removeId = (arr, id) => 
    removeFromArrySet(arr, id, CHECK_EQUALITY_MONGOOSE_ID);

  switch (interactionType) {
    case "unvote": {
      interactionInfo.upvoterIds = removeId(interactionInfo.upvoterIds, _userId);
      interactionInfo.downvoterIds = removeId(interactionInfo.downvoterIds, _userId);
      break;
    }
    case "downvote": {
      interactionInfo.upvoterIds = removeId(interactionInfo.upvoterIds, _userId);
      interactionInfo.downvoterIds = addId(interactionInfo.downvoterIds, _userId);
      break;
    }
    case "upvote": {
      interactionInfo.upvoterIds = addId(interactionInfo.upvoterIds, _userId);
      interactionInfo.downvoterIds = removeId(interactionInfo.downvoterIds, _userId);
      break;
    }
    case "follow": {
      interactionInfo.followerIds = addId(interactionInfo.followerIds, _userId);
      break;
    }
    case "unfollow": {
      interactionInfo.followerIds = removeId(interactionInfo.followerIds, _userId);
      break;
    }
    default: {
      throw `The interaction ${interactionType} is invalid.`
    }
  }
}


/**
 * @typedef {"upvote" | "downvote" | "follow" | "unvote" | "unfollow"} InteractionInfoTypes
 */