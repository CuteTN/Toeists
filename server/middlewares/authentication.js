import { httpStatusCodes } from '../utils/httpStatusCode.js'
import { verifyJwt } from "../services/jwtHelper.js";

const authorize = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split?.(" ")?.[1];

    if (!token)
      return res.status(httpStatusCodes.unauthorized).json({ message: "No authorization." });

    const verification = verifyJwt(token);

    if (!verification.valid)
      return res.status(httpStatusCodes.unauthorized).json({ message: `Invalid token: `, detail: verification.error });

    req.userId = verification.payload.userId;

    next?.();
  } catch (error) {
    console.error(error);
    return res.status(httpStatusCodes.internalServerError).json({ message: error.message });
  }
};

export default authorize;
