import mongoose from 'mongoose'
import { Forum } from "../models/forum.js";
import { Hashtag } from "../models/hashtag.js";
import { User } from "../models/user.js";

/**
 * @param {string} name 
 * @returns {{ isValid: boolean, message: string }}
 */
export const validateHashtagName = (name) => {
  const returnError = (message) => ({
    isValid: false,
    message,
  })

  if (!name)
    return returnError("The hash tag name is required");
  if (!/^[a-zA-Z0-9_]*$/.test(name))
    return returnError("Hash tag name can only contain English characters, numbers or underscores ")

  return {
    isValid: true,
    message: null,
  }
}

/**
 * @param {string[]} hashtagNames 
 * @returns Returns the existing hashtags
 */
export const findExistingHashtags = async (hashtagNames) =>
  await Hashtag.find({
    name: {
      $in: hashtagNames
    }
  });

/**
 * @param {string[]} hashtagNames 
 */
export const upsertHashtagPreferences = async (hashtagNames) => {
  const existingHashTags = await findExistingHashtags(hashtagNames);

  for (let i = 0; i < hashtagNames.length; i++) {
    const hashtag = existingHashTags.find(ht => ht?.name === hashtagNames[i]);

    if (hashtag) {
      // Yes, it's ==
      if (hashtag.count == null)
        hashtag.count = 0;

      hashtag.count++;
      // await hashtag.save?.();
    }
    else {
      const newHashtag = {
        count: 1,
        name: hashtagNames[i],
      }
      try {
        await Hashtag.create(newHashtag);
      }
      catch { }
    }
  }

  await Hashtag.bulkSave(existingHashTags);
}

/**
 * @param {string[]} hashtagNames 
 */
export const reduceHashtagPreferences = async (hashtagNames) => {
  const existingHashTags = await findExistingHashtags(hashtagNames);

  for (let i = 0; i < existingHashTags.length; i++) {
    const hashtag = existingHashTags[i];

    if (hashtag.count > 0)
      hashtag.count--;
    await hashtag.save?.();
  }

  await Hashtag.bulkSave(existingHashTags);
}


export const refreshHashtags = async () => {
  const users = await User.find();
  const forums = await Forum.find();
  const counter = {};

  users.forEach(user => {
    user.hashtagIds.forEach(hashtagId => {
      const idStr = hashtagId.toString();

      if (counter[idStr])
        counter[idStr]++;
      else
        counter[idStr] = 1;
    })
  });

  forums.forEach(forum => {
    forum.hashtagIds.forEach(hashtagId => {
      const idStr = hashtagId.toString();

      if (counter[idStr])
        counter[idStr]++;
      else
        counter[idStr] = 1;
    })
  });

  const hashtags = await Hashtag.find();
  hashtags.forEach(hashtag => {
    const idStr = hashtag._id.toString();
    hashtag.count = counter[idStr] ?? 0;
  })

  await Hashtag.bulkSave(hashtags);
  await Hashtag.deleteMany({ count: 0 });
}