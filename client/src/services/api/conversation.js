import { apiService } from "./index";

const CONVERSATION_ROUTE = "/api/conversations";

export const createConversation = (conversation) => apiService.post(CONVERSATION_ROUTE, conversation);
export const getConversations = () => apiService.get(CONVERSATION_ROUTE);
export const getConversationById = (id) => apiService.get(`${CONVERSATION_ROUTE}/${id}`);
export const getPrivateConversationByPartnerId = (partnerId) => apiService.get(`${CONVERSATION_ROUTE}/private/${partnerId}`);
export const updateConversation = (id, conversation) => apiService.put(`${CONVERSATION_ROUTE}/${id}`, conversation)
export const setMemberOfConversation = (id, memberIds) => apiService.put(`${CONVERSATION_ROUTE}/${id}/members`, { memberIds });
export const updateMemberRolesOfConversation = (id, members) => apiService.put(`${CONVERSATION_ROUTE}/${id}/member-roles`, { members });

/** 
 * @param {{ memberId: string, role: "none"|"admin"}[]} memberInfos 
*/
export const setMembersThenRoleInConversation = async (conversationId, memberInfos) => {
  const memberIds = memberInfos.map(({ memberId }) => memberId );
  await setMemberOfConversation(conversationId, memberIds);
  await updateMemberRolesOfConversation(conversationId, memberInfos);
}

export const createConversationThenSetRoles = async (conversation) => {
  if (!conversation?.members)
    return;

  conversation.memberIds = conversation?.members.map(({memberId}) => memberId)
  const id = (await createConversation(conversation)).data._id;
  await updateMemberRolesOfConversation(id, conversation.members);
}

// updating self information
export const updateConversationMyBlockedState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-blocked-state`, { value });
export const updateConversationMyMutedState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-muted-state`, { value });
export const updateConversationMySeenState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-seen-state`, { value });
export const updateConversationMyNickname = (id, nickname) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-seen-state`, { nickname });