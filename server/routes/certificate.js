import express from "express";
import * as controllers from "../controllers/certificate.js";
import { authorizeMdw } from "../middlewares/authorization.js";
import { findByIdMdwFn } from "../middlewares/findById.js";
import { Certificate } from "../models/certificate.js"
import { createSwaggerPath, SwaggerTypes } from "../utils/swagger.js";

export const certificatesRouter = express.Router();

const checkIsCertificateOwner = (certificate, req) => {
  if (!certificate.ownerId.equals(req.attached?.decodedToken?.userId))
    return "Only the certificate's owner can access this data."
}

certificatesRouter.post("/", authorizeMdw, controllers.createCertificate );

certificatesRouter.get("/:id", findByIdMdwFn({ model: Certificate }), controllers.getCertificateById );
certificatesRouter.put("/:id", authorizeMdw, findByIdMdwFn({ model: Certificate, forbiddenChecker: checkIsCertificateOwner }), controllers.updateCertificate);
certificatesRouter.delete("/:id", authorizeMdw, findByIdMdwFn({ model: Certificate, forbiddenChecker: checkIsCertificateOwner }), controllers.deleteCertificate);

const controllerName = "certificates";
export const certificatesSwaggerPaths = {
  [`/${controllerName}/`]: {
    post: createSwaggerPath(
      "Create a new certificate.",
      [controllerName],
      null,
      SwaggerTypes.ref("Certificate"),
      SwaggerTypes.ref("Certificate"),
    )
  },

  [`/${controllerName}/{id}`]: {
    get: createSwaggerPath(
      "Get a certificate by its ID.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      SwaggerTypes.ref("Certificate"),
    ),

    put: createSwaggerPath(
      "Update a certificate. This API does NOT update certificate verification.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      SwaggerTypes.ref("Certificate"),
      SwaggerTypes.ref("Certificate"),
    ),

    delete: createSwaggerPath(
      "Delete a certificate.",
      [controllerName],
      [
        {
          name: "id",
          required: true,
          in: "path",
          schema: SwaggerTypes.string(),
        }
      ],
      null,
      null
    ),
  },
}