import express from 'express'
import { cuteIO } from '../index.js'
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** @type {express.RequestHandler} */
export const requestReloadBrowser = async (req, res, next) => {
  const { browserId } = req.body ?? {};
  cuteIO.sendToBrowser(browserId, "System-RequestReload");
  return res.sendStatus(httpStatusCodes.accepted);
}