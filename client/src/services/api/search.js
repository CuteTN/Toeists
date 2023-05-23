import { apiService } from ".";

export const searchForConversations = (text, limit) => 
  apiService.post('api/search/conversations/data?no-save=true', { text, pageSize: limit, page: 0 });

export const searchForUser = (text, limit, page = 0, noSave = true) => 
  apiService.post(`api/search/users/data?no-save=${noSave}`, { text, pageSize: limit, page });

export const searchForForum = (text, limit, page = 0, noSave = true) => 
  apiService.post(`api/search/forums/data?no-save=${noSave}`, { text, pageSize: limit, page });