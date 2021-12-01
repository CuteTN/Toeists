import { apiService } from "./index";

const CONVERSATION_ROUTE = "/api/conversations";

export const getConversations = () => apiService.get(CONVERSATION_ROUTE);
export const getConversationById = (id) => apiService.get(`${CONVERSATION_ROUTE}/${id}`);