const express = require("express");
const router = express.Router();
const developmentController = require("../controllers/developmentController");
const valuationController = require("../controllers/valuationController");

// DEVELOPMENT ROUTES
router.post("/developments/add", developmentController.createDevelopment);
router.get("/developments/get", developmentController.getDevelopments);
router.get("/developments/get/:id", developmentController.getOneDevelopment);
router.post("/developments/mod", developmentController.editDevelopment);
router.delete("/developments/:id", developmentController.deleteDevelopment);
router.post("/developments/coords", developmentController.getCoordinates);
router.get("/developments/mapping/get", developmentController.getMappingInfo);
router.post(
  "/developments/send-match-email",
  developmentController.sendMatchEmail
);

// VALUATION ROUTES
router.post("/valuation/send-email-full", valuationController.sendEmailFull);
router.post("/valuation/send-email-sale", valuationController.sendEmailSale);
router.post(
  "/valuation/send-email-internal",
  valuationController.sendEmailInternalFail
);
router.post("/valuation/book-val", valuationController.sendEmailBookVal);

module.exports = router;
