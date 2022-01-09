import express from "express";
import * as controllers from "../controllers/contest.js";
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";
import { authorizeMdw } from '../middlewares/authorization.js'
import { findByIdMdwFn } from "../middlewares/findById.js";
import { ContestPart } from "../models/contestPart.js";

export const contestPartRouter = express.Router();

const checkIsContestPartCreator = (contestPart, req) => {
  if (!contestPart.creatorId.equals(req.attached?.decodedToken?.userId))
    return "Only the contest part creator can access this data."
}

contestPartRouter.get("/", controllers.getAllContestParts);
contestPartRouter.get("/:id", findByIdMdwFn({ model: ContestPart }), controllers.getContestPartById);

contestPartRouter.post("/", authorizeMdw, controllers.createContestPart);
contestPartRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: ContestPart, forbiddenChecker: checkIsContestPartCreator }), controllers.deleteContestPart);

const controllerName = "contest-parts";
export const contestPartsSwaggerPaths = {
  [`/${controllerName}/`]: {
    get: createSwaggerPath(
      "Get all contest parts.",
      [controllerName],
      null,
      null,
      SwaggerTypes.array(SwaggerTypes.ref("ContestPart"))
    ),

    post: createSwaggerPath(
      "Create a new contest part.",
      [controllerName],
      null,
      SwaggerTypes.ref("ContestPart"),
      SwaggerTypes.ref("ContestPart"),
    ),

  },

  [`/${controllerName}/{id}`]: {
    get: createSwaggerPath(
      "Retrieve a contest part by id.",
      [controllerName],
      [
        {
          name: "id",
          in: "path",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.ref("ContestPart"),
    ),
     
    delete: createSwaggerPath(
      "Remove a contest part.",
      [controllerName],
      [
        {
          name: "id",
          in: "path",
          required: true,
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      null,
    )
  },
}