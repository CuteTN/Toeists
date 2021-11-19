import mongoose from 'mongoose'

/**
 * @template TItem
 * @param {TItem[]} original 
 * @param {(a: TItem, b: TItem) => boolean} checkEquality
 * @returns {TItem[]}
 */
export const removeDuplication = (original, checkEquality) => {
  return original.filter((item, i) => {
    return !original.some((succItem, j) =>
      (i > j)
      &&
      checkEquality?.(succItem, item)
    )
  })
}

/**
 * @template TItem
 * @param {TItem[]} original 
 * @param {TItem} newItem
 * @param {(a: TItem, b: TItem) => boolean} checkEquality
 * @returns {TItem[]}
 */
export const addToArraySet = (original, newItem, checkEquality) => {
  const result = [...original];
  if (!original.find(item => checkEquality(item, newItem)))
    result.push(newItem);
  return result;
}

export const removeFromArrySet = (original, deletedItem, checkEquality) => {
  return original.filter(item => !checkEquality(deletedItem, item));
}

///
export const CHECK_EQUALITY_DEFAULT = (a, b) => a === b
export const CHECK_EQUALITY_MONGOOSE_ID = (a, b) => {
  try {
    var aAsId = new mongoose.Types.ObjectId(a);
    var bAsId = new mongoose.Types.ObjectId(b);
  }
  catch {
    // if one of the two is not a valid Mongoose object id
    return false;
  }
    
  return aAsId.equals(bAsId);
}
