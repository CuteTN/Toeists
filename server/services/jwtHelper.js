import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../index.js";

/**
 * @param {Object} payload 
 * @param {jwt.SignOptions?} options 
 * @returns {string} token
 */
export const signJwt = (payload, options) => {
  return jwt.sign(payload, jwtSecretKey, options);
}

/**
 * Verify the token with the secret key, including expiration time.
 * @param {string} token 
 * @param {jwt.VerifyOptions} options 
 * @returns {VerifyJwtResultType} You will know it.
 */
export const verifyJwt = (token, options) => {
  let payload = undefined;
  let error = undefined;
  let valid = false;

  try { payload = jwt.verify(token, jwtSecretKey, options); valid = true; }
  catch(err) { error = err; valid = false; }

  return {
    error,
    payload,
    isValid: valid
  }
};

/**
 * @typedef {Object} VerifyJwtResultType
 * @property {boolean} isValid
 * @property {jwt.JwtPayload} payload
 * @property {jwt.VerifyErrors} error
 */
