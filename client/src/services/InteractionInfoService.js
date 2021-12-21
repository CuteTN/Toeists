export const getInteractionInfoOfUser = (userId, interactionInfo) => ({
  hasUpvoted: interactionInfo?.upvoterIds.includes(userId),
  hasDownvoted: interactionInfo?.downvoterIds.includes(userId),
  hasFollowed: interactionInfo?.followerIds.includes(userId),
})