import { apiService } from './index'

export const checkAuthorization = () => apiService.get('api/authorization');