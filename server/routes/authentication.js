import express from "express";
import * as controllers from "../controllers/authentication.js";
// import authorize from "../middlewares/authentication.js";

export const authenticationRouter = express.Router();

authenticationRouter.post("/signup", controllers.signUp);
authenticationRouter.post("/signin", controllers.signIn);
authenticationRouter.post("/refresh-token", controllers.refreshToken);

authenticationRouter.delete("/invalidate", controllers.invalidateRefreshToken);

// authenticationRouter.get("/newUsers/:range/:timeString", countNewUsers);
// authenticationRouter.get("/password/check/:password", auth, checkPassword);
// authenticationRouter.get("/checkAdminSystem", auth, checkAdminSystem);

// authenticationRouter.post("/signin", signin);
// authenticationRouter.post("/resend", resendVerificationMail);
// authenticationRouter.post("/signout", signout);

// authenticationRouter.put("/password/change", auth, changePassword);
// authenticationRouter.put("/verify/:token", verifyToken);

// // user status APIs
// authenticationRouter.get("/list/friendsStatus", auth, getFriendsStatus);
// authenticationRouter.get("/getStatus", auth, getUserStatus);
// authenticationRouter.put("/setStatus/:newStatus", auth, setUserStatus);