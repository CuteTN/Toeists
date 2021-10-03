import express from "express";
export const rootRouter = express.Router();

rootRouter.get("/", function (req, res, next) {
  res.send("<h1>Welcome to TOEISTS api</h1>");
});