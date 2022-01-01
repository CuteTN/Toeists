import { invalidateRefreshToken, refreshToken, signIn } from "./api/user";
import { TokenService } from "./TokenService";
import { EventEmitter } from 'events'

export class AuthenticationService {
  static #onSignedInEvent = new EventEmitter();
  static #onSignedOutEvent = new EventEmitter();

  /**
   * @param {SignedInEventListener} listener 
   * @returns the listener itself for convenience
   */
  static onSignedIn = (listener) => {
    this.#onSignedInEvent.on("", listener);
    return listener;
  }

  /**
   * @param {SignedInEventListener} listener 
   * @returns the listener itself for convenience
   */
  static offSignedIn = (listener) => {
    this.#onSignedInEvent.off("", listener);
    return listener;
  }

  /**
   * @param {SignedInEventListener} listener 
   * @returns the listener itself for convenience
   */
  static onceSignedIn = (listener) => {
    this.#onSignedInEvent.once("", listener);
    return listener;
  }

  /**
   * @param {SignedOutEventListener} listener 
   * @returns the listener itself for convenience
   */
  static onSignedOut = (listener) => {
    this.#onSignedOutEvent.on("", listener);
    return listener;
  }

  /**
   * @param {SignedOutEventListener} listener 
   * @returns the listener itself for convenience
   */
  static offSignedOut = (listener) => {
    this.#onSignedOutEvent.off("", listener);
    return listener;
  }

  /**
   * @param {SignedOutEventListener} listener 
   * @returns the listener itself for convenience
   */
  static onceSignedOut = (listener) => {
    this.#onSignedOutEvent.once("", listener);
    return listener;
  }

  static async signIn(identifier, password) {
    let response = null;
    try {
      await this.signOut();
      response = await signIn(identifier, password);
      this.saveTokens(response.data ?? {});

      try { var payload = TokenService.decodeAccessToken() }
      catch { return null }

      this.#onSignedInEvent.emit("", payload);
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
        this.#onSignedOutEvent.emit("");
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
      // NOTE: this is to deal with the async error when calling refresh token too fast
      if (currentRefreshToken === TokenService.refreshToken && TokenService.refreshToken) {
        this.signOut();
        throw error;
      }
    }
  }

  static saveTokens({ accessToken, refreshToken, username, userId }) {
    TokenService.accessToken = accessToken;
    TokenService.refreshToken = refreshToken;

    // DIRTY: storing username and userId is only for testing purposes
    if(username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
    if(userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");

    // DIRTY: It's a bad idea to reload the window here because it's not the right purpose of this function
    window.location.reload();
  }
}

/**
 * @typedef {(userIdentifier: {userId: string, username: string, email: string}) => void} SignedInEventListener
 * @typedef {() => void} SignedOutEventListener
 */