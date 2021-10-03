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
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

export const userRouter = express.Router();

userRouter.get("/newUsers/:range/:timeString", countNewUsers);
userRouter.get("/password/check/:password", auth, checkPassword);
userRouter.get("/checkAdminSystem", auth, checkAdminSystem);

userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
userRouter.post("/resend", resendVerificationMail);
userRouter.post("/signout", signout);

userRouter.put("/password/change", auth, changePassword);
userRouter.put("/verify/:token", verifyToken);

// user status APIs
userRouter.get("/list/friendsStatus", auth, getFriendsStatus);
userRouter.get("/getStatus", auth, getUserStatus);
userRouter.put("/setStatus/:newStatus", auth, setUserStatus);