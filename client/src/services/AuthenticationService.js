import { invalidateRefreshToken, refreshToken, signIn } from "./api/authentication";
import { TokenService } from "./TokenService";

export class AuthenticationService {
  static async signIn(identifier, password) {
    let response = null;
    try {
      response = await signIn(identifier, password);
      this.saveTokens(response.data ?? {});
      return response;
    }
    catch (error) { 
      console.error("Sign in error:", error); 
      throw error;
    }
  }

  static async signOut() {
    const refreshToken = TokenService.refreshToken;

    if (refreshToken) {
      try {
        await invalidateRefreshToken(refreshToken);
        this.saveTokens({ accessToken: null, refreshToken: null });
      }
      catch (error) { 
        console.error("Sign out error:", error); 
        throw error;
      }
    }
  }

  static async refreshToken() {
    const currentRefreshToken = TokenService.refreshToken;

    let response = null;
    try {
      response = await refreshToken(currentRefreshToken);
      this.saveTokens(response.data ?? {});
    }
    catch (error) { 
      this.signOut(currentRefreshToken);
      throw error;
    }
  }

  static saveTokens({ accessToken, refreshToken }) {
    TokenService.accessToken = accessToken;
    TokenService.refreshToken = refreshToken;
  }
}