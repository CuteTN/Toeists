import { apiService } from "./index";

const CONVERSATION_ROUTE = "/api/conversations";

export const getConversations = () => apiService.get(CONVERSATION_ROUTE);
export const getConversationById = (id) => apiService.get(`${CONVERSATION_ROUTE}/${id}`);
export const getPrivateConversationByPartnerId = (partnerId) => apiService.get(`${CONVERSATION_ROUTE}/private/${partnerId}`);
export const updateConversation = (id, conversation) => apiService.put(`${CONVERSATION_ROUTE}/${id}`, conversation)

// updating self information
export const updateConversationMyBlockedState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-blocked-state`, { value });
export const updateConversationMyMutedState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-muted-state`, { value });
export const updateConversationMySeenState = (id, value) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-seen-state`, { value });
export const updateConversationMyNickname = (id, nickname) =>
  apiService.put(`${CONVERSATION_ROUTE}/${id}/my-seen-state`, { nickname });

