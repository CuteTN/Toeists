import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { apiRouter, rootRouter, systemRouter } from "./routes/index.js";
import { setUpCuteIO } from "./socket/handlers/allHandlers.js";
import UsersStatusManager from "./services/userStatus.js";
import CuteServerIO from "./socket/CuteServerIO.js";
import swaggerUI from 'swagger-ui-express'
import { getAppSwaggerSpecs } from "./routes/swaggerConfig.js";
import nodemailer from 'nodemailer'

import Grid from 'gridfs-stream';
import methodOverride from 'method-override';
import { GridFsStorage } from "multer-gridfs-storage";
import path from "path";
import crypto from "crypto";

dotenv.config();

const app = express();

// socket io set up
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

export const cuteIO = new CuteServerIO(io);
export const usersStatusManager = new UsersStatusManager();
usersStatusManager.init(cuteIO);
setUpCuteIO(cuteIO);
cuteIO.start();

const SERVER_PORT = process.env.SERVER_PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;

export const imgbbApiKey = process.env.IMGBB_API_KEY;
export const jwtSecretKey = process.env.JWT_KEY;

export const appEmail = process.env.APP_EMAIL;
export const appEmailPassword = process.env.APP_EMAIL_PASSWORD;
export const smtpTransport = nodemailer.createTransport({
  from: appEmail,
  service: "gmail",
  auth: {
    user: appEmail,
    pass: appEmailPassword
  }
});

export const clientUrl = process.env.CLIENT_URL;

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(methodOverride('_method'));

// const __dirname = path.resolve(
//   path.dirname(decodeURI(new URL(import.meta.url).pathname))
// );
// app.use(express.static(path.join(__dirname, "public")));

const swaggerSpecs = getAppSwaggerSpecs(process.env.SERVER_URL);

// router
app.use("/", rootRouter);
app.use("/api-doc/", swaggerUI.serve, swaggerUI.setup(swaggerSpecs,
  {
    swaggerOptions: {
      docExpansion: "none",
      operationsSorter: "alpha",
      methodsSorter: "alpha",
      tagsSorter: "alpha",
      persistAuthorization: true,
    },
  },
));

app.use("/api", apiRouter);
app.use("/system", systemRouter);

export let gridFsBucket = null;

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {

    gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
      bucketName: "uploads",
    })

    server.listen(SERVER_PORT, () =>
      console.info(`Server Running on Port: http://localhost:${SERVER_PORT}`)
    );
  })
  .catch((error) => console.error(`${error} did not connect`));