import express from "express";
export const rootRouter = express.Router();

/* GET home page. */
rootRouter.get("/", function (req, res, next) {
  res.send("<h5>Welcome to TOEISTS api</h5>");
});