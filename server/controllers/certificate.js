import express from 'express'
import { Certificate, CERTIFICATE_VIRTUAL_FIELDS } from '../models/certificate.js';
import { httpStatusCodes } from '../utils/httpStatusCode.js';

/** @type {express.RequestHandler} */
export const createCertificate = async (req, res, next) => {
  const newCertificate = req.body;

  if (!newCertificate)
    return res.status(httpStatusCodes.badRequest).json({ message: "Request body is required." });

  newCertificate.ownerId = req.attached.decodedToken.userId;
  newCertificate.isVerified = false;

  try {
    const createdCertificate = await Certificate.create(newCertificate);
    await createdCertificate.populate(CERTIFICATE_VIRTUAL_FIELDS);
    return res.status(httpStatusCodes.ok).json(createdCertificate);
  }
  catch (error) {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while creating a new certificate.", error })
  }
}


/** @type {express.RequestHandler} */
export const getCertificateById = async (req, res, next) => {
  const certificate = req.attached.targetedData;
  await certificate.populate(CERTIFICATE_VIRTUAL_FIELDS);
  return res.status(httpStatusCodes.ok).json(certificate);
}


/** @type {express.RequestHandler} */
export const updateCertificate = async (req, res, next) => {
  const certificateToUpdate = req.body;

  delete certificateToUpdate.ownerId;
  delete certificateToUpdate.isVerified;

  try {
    const updatedCertificate = await Certificate
      .findByIdAndUpdate(req.params.id, certificateToUpdate, { new: true, runValidators: true })
      .populate(CERTIFICATE_VIRTUAL_FIELDS)

    return res.status(httpStatusCodes.ok).json(updatedCertificate);
  }
  catch {
    return res.status(httpStatusCodes.badRequest).json({ message: "Error while updating the certificate." });
  }
}


/** @type {express.RequestHandler} */
export const deleteCertificate = async (req, res, next) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    return res.sendStatus(httpStatusCodes.ok);
  }
  catch (error) {
    return res.status(httpStatusCodes.internalServerError).json({ message: "Error while deleting certificate", error })
  }
}