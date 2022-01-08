import { apiService } from ".";

export const searchForConversations = (text, limit) => 
  apiService.post('api/search/conversations/data?no-save=true', { text, pageSize: limit, page: 0 });