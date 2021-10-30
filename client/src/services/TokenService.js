import jwtDecode from 'jwt-decode'
import events from 'events'

export class TokenService {
  static get ACCESS_TOKEN_NAME() { return 'access-token' }
  static get REFRESH_TOKEN_NAME() { return 'refresh-token' }
  static #onAccessTokenChangeEvent = new events.EventEmitter();

  /**
   * @param {AccessTokenChangeEventListener} listener 
   * @returns {AccessTokenChangeEventListener}
   */
  static onAccessTokenChange = (listener) => {
    this.#onAccessTokenChangeEvent.on("", listener);
    return listener;
  }

  /**
   * @param {AccessTokenChangeEventListener} listener 
   * @returns {AccessTokenChangeEventListener}
   */
  static offAccessTokenChange = (listener) => {
    this.#onAccessTokenChangeEvent.off("", listener);
    return listener;
  }

  /** @type {string | undefined} */
  static get accessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_NAME);
  }

  static set accessToken(token) {
    if (!token) {
      localStorage.removeItem(this.ACCESS_TOKEN_NAME);
      this.#onAccessTokenChangeEvent.emit("", null);
    }
    else {
      localStorage.setItem(this.ACCESS_TOKEN_NAME, token);
      this.#onAccessTokenChangeEvent.emit("", token);
    }
  }

  /** @type {string | undefined} */
  static get refreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_NAME);
  }

  static set refreshToken(token) {
    if (!token)
      localStorage.removeItem(this.REFRESH_TOKEN_NAME);
    else
      localStorage.setItem(this.REFRESH_TOKEN_NAME, token);
  }

  /**
   * @returns throw an error if the token is invalid
   */
  static decodeAccessToken() {
    return jwtDecode(this.accessToken);
  }
}

/**
 * @typedef {(newAccessToken: string | null) => void} AccessTokenChangeEventListener
 */