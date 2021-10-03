import express from "express";
import {
  changePassword,
  checkPassword,
  resendVerificationMail,
  signin,
  signup,
  verifyToken,
  signout,
  getFriendsStatus,
  setUserStatus,
  getUserStatus,
  checkAdminSystem,
  countNewUsers,
} from "../controllers/authentication.js";
import auth from "../middlewares/authentication.js";

export const authenticationRouter = express.Router();

authenticationRouter.get("/newUsers/:range/:timeString", countNewUsers);
authenticationRouter.get("/password/check/:password", auth, checkPassword);
authenticationRouter.get("/checkAdminSystem", auth, checkAdminSystem);

authenticationRouter.post("/signin", signin);
authenticationRouter.post("/signup", signup);
authenticationRouter.post("/resend", resendVerificationMail);
authenticationRouter.post("/signout", signout);

authenticationRouter.put("/password/change", auth, changePassword);
authenticationRouter.put("/verify/:token", verifyToken);

// user status APIs
authenticationRouter.get("/list/friendsStatus", auth, getFriendsStatus);
authenticationRouter.get("/getStatus", auth, getUserStatus);
authenticationRouter.put("/setStatus/:newStatus", auth, setUserStatus);