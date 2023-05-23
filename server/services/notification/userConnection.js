import { sendNotificationToUser } from "./notificationBase.js"

export const sendNoti_FollowUser = async (fromUser, toUserId) => {
  const { name, username } = fromUser

  if (name && toUserId)
    await sendNotificationToUser({
      receiverId: toUserId,
      title: "New follower",
      text: `${name} (${username}) has started following you.`,
      kind: "UserConnection_FollowUser",
      url: `/userinfo/${toUserId}`
    })
}