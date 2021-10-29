import { apiService } from './index';

const USER_CONNECTIONS_ROUTE = '/api/user-connections/';

export const follow = async (toUserId) =>
  apiService.post(USER_CONNECTIONS_ROUTE + '/follow', { toUserId });
export const block = async (toUserId) =>
  apiService.post(USER_CONNECTIONS_ROUTE + '/block', { toUserId });

export const unfollow = async (toUserId) =>
  apiService.delete(USER_CONNECTIONS_ROUTE + '/unfollow', { toUserId });
export const unblock = async (toUserId) =>
  apiService.delete(USER_CONNECTIONS_ROUTE + '/unblock', { toUserId });