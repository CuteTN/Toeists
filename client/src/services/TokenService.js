export class TokenService {
  static get ACCESS_TOKEN_NAME() { return 'access-token' }
  static get REFRESH_TOKEN_NAME() { return 'refresh-token' }

  /** @type {string | undefined} */
  static get accessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_NAME);
  }

  static set accessToken(token) {
    if (!token)
      localStorage.removeItem(this.ACCESS_TOKEN_NAME);
    else
      localStorage.setItem(this.ACCESS_TOKEN_NAME, token);
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
}