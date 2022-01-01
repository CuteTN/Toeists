import { sendNotificationToUser } from "./notificationBase.js"

/**
 * @param {"forum"|"comment"} mediaType
 */
export const sendNoti_UpvoteMedia = async (interactor, media, mediaType, forumId, forumTitle) => {
  const { name, username } = interactor ?? {};

  let mediaOwnerId, notiText;
  switch (mediaType) {
    case "forum": {
      mediaOwnerId = media?.creatorId;
      forumTitle = media?.title;
      notiText = `${name} (${username}) has upvoted your forum: "${forumTitle}".`;
      break;
    }
    case "comment": {
      mediaOwnerId = media?.creatorId;
      notiText = `${name} (${username}) has upvoted your comment on the forum: "${forumTitle}".`;
      break;
    }
  }

  if(mediaOwnerId.toString() === interactor?._id.toString())
    return;

  if (name && username && mediaOwnerId && forumTitle && forumId)
    await sendNotificationToUser({
      receiverId: mediaOwnerId,
      title: "New upvote",
      text: notiText,
      kind: "UserConnection_FollowUser",
      url: `/forums/${forumId}`
    })
}