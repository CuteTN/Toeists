import mongoose from 'mongoose'

/**
 * @param {*} forum 
 * @param {string?} userId userId can be null, which indicates an anonymous user
 * @returns 
 */
export const checkIsForumVisibleByUser = (forum, userId) => {
  if (!forum)
    return false;
  
  /** @type {mongoose.Types.ObjectId} */
  let _userId = null;
  try {
    _userId = new mongoose.Types.ObjectId(userId);
  }
  catch { }

  switch (forum.privacy.toUpperCase()) {
    case "PUBLIC": return true;
    case "PRIVATE": return _userId?.equals(forum?.creatorId);
    default: return _userId.equals(forum?.creatorId);
  }
}