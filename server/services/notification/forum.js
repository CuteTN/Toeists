import { UserConnection } from "../../models/userConnection.js";
import { CHECK_EQUALITY_MONGOOSE_ID, removeDuplication } from "../../utils/arraySet.js";
import { getAllConnectionsOfUser } from "../userConnection.js";
import { sendNotificationToUser } from "./notificationBase.js"

export const sendNoti_CreateForum = async (creator, forum) => {
  const { name: creatorName, username, _id: creatorId } = creator ?? {};
  const { _id: forumId, title } = forum ?? {};
  const userConnections = await UserConnection.find();

  let { followerIds: creatorFollowerIds } = getAllConnectionsOfUser(creatorId, userConnections);
  creatorFollowerIds = removeDuplication(creatorFollowerIds, CHECK_EQUALITY_MONGOOSE_ID);

  if (
    creatorName &&
    username &&
    creatorId &&
    forumId &&
    title &&
    Array.isArray(creatorFollowerIds)
  )
    for (let receiverId of creatorFollowerIds) {
      await sendNotificationToUser({
        receiverId: receiverId,
        title: "New forum",
        text: `${creatorName} (${username}) has posted a new forum: "${title}"`,
        kind: "Forum_CreateForum",
        url: `/forums/${forumId}`
      })
    }
}

export const sendNoti_UpdateForum = async (creator, forum) => {
  const { name: creatorName, username, _id: creatorId } = creator ?? {};
  const { _id: forumId, title } = forum ?? {};
  const userConnections = await UserConnection.find();

  const { followerIds: creatorFollowerIds } = getAllConnectionsOfUser(creatorId, userConnections);

  if (!forum.populated("interactionInfo"))
    await forum.populate("interactionInfo");
  const { followerIds: forumFollowerIds } = forum?.interactionInfo ?? {};

  const receiverIds = removeDuplication([...forumFollowerIds, ...creatorFollowerIds]);

  if (
    creatorName &&
    username &&
    creatorId &&
    forumId &&
    title &&
    Array.isArray(receiverIds)
  )
    for (let receiverId of receiverIds) {
      await sendNotificationToUser({
        receiverId: receiverId,
        title: "Forum update",
        text: `${creatorName} (${username}) has updated their forum: "${title}"`,
        kind: "Forum_UpdateForum",
        url: `/forums/${forumId}`
      })
    }
}