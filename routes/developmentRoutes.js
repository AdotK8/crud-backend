const express = require("express");
const router = express.Router();
const developmentController = require("../controllers/developmentController");
const valuationController = require("../controllers/valuationController");

// DEVELOPMENT ROUTES
router.post("/developments/add", developmentController.createDevelopment); // test done
router.get("/developments/get", developmentController.getDevelopments); // test done
router.get("/developments/get/:id", developmentController.getOneDevelopment); // test done
router.post("/developments/mod", developmentController.editDevelopment); // test done
router.delete("/developments/:id", developmentController.deleteDevelopment); // test done
router.get("/developments/mapping/get", developmentController.getMappingInfo); // test done
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
