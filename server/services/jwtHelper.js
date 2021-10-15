import jwt from "jsonwebtoken";
const JWT_KEY = "TOEISTS_SUPER_SECRET_KEY";

/**
 * @param {Object} payload 
 * @param {jwt.SignOptions?} options 
 * @returns {string} token
 */
export const signJwt = (payload, options) => {
  return jwt.sign(payload, JWT_KEY, options);
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

  try { payload = jwt.verify(token, JWT_KEY, options); valid = true; }
  catch(err) { error = err; valid = false; }

  return {
    error,
    payload,
    valid
  }
};

/**
 * @typedef {Object} VerifyJwtResultType
 * @property {boolean} valid
 * @property {jwt.JwtPayload} payload
 * @property {jwt.VerifyErrors} error
 */
