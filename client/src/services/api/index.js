// source: https://www.bezkoder.com/react-refresh-token/

import axios from "axios";

import { BACKEND_URL } from "../../constants/config";
import { AuthenticationService } from "../AuthenticationService";
import { TokenService } from "../TokenService";
import { SIGN_IN_ROUTE } from "./authentication";

export const apiService = axios.create({ baseURL: BACKEND_URL });

apiService.interceptors.request.use((req) => {
  const token = TokenService.accessToken;
  if (token) 
    req.headers.Authorization = `Bearer ${token}`;
  
  return req;
});

apiService.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== SIGN_IN_ROUTE && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          if(!TokenService.refreshToken)
            return Promise.reject(err);
            
          await AuthenticationService.refreshToken(TokenService.refreshToken);
          return apiService(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);