import { UserConnection } from "../../models/userConnection.js";
import { getAllConnectionsOfUser } from "../userConnection.js";
import { sendNotificationToUser } from "./notificationBase.js"

export const sendNoti_CreateComment = async (creator, forum) => {
  const { name: creatorName, username, _id: creatorId } = creator ?? {};
  const { _id: forumId, title, creatorId: forumCreatorId } = forum ?? {};

  if (creatorId.toString() === forumCreatorId.toString())
    return;

  if (
    creatorName &&
    username &&
    creatorId &&
    forumId &&
    title
  )
    await sendNotificationToUser({
      receiverId: forumCreatorId,
      title: "New comment",
      text: `${creatorName} (${username}) has commented on your forum: "${title}"`,
      kind: "Comment_CreateComment",
      url: `/forums/${forumId}`
    })
}

export const sendNoti_UpdateComment = async (creator, forum) => {
  const { name: creatorName, username, _id: creatorId } = creator ?? {};
  const { _id: forumId, title, creatorId: forumCreatorId } = forum ?? {};

  if (creatorId.toString() === forumCreatorId.toString())
    return;

  if (
    creatorName &&
    username &&
    creatorId &&
    forumId &&
    title
  )
    await sendNotificationToUser({
      receiverId: forumCreatorId,
      title: "Comment update",
      text: `${creatorName} (${username}) has updated their comment on your forum: "${title}"`,
      kind: "Comment_UpdateComment",
      url: `/forums/${forumId}`
    })
}