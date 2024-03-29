import CuteServerIO from "../CuteServerIO.js";
import { setUpOnReceiveMessages } from "./MessageHandlers.js";
import { isValidUser } from "../../services/users.js"

/**
 * @param {CuteServerIO} cuteIO
 */
export const setUpCuteIO = (cuteIO) => {
  setUpOnReceiveMessages(cuteIO);
  cuteIO.verifyUser = isValidUser;
};
