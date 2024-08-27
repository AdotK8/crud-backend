const express = require("express");
const router = express.Router();
const developmentController = require("../controllers/developmentController");
const emailController = require("../controllers/emailController");

// Development routes
router.post("/developments/add", developmentController.createDevelopment);
router.get("/developments/get", developmentController.getDevelopments);
router.get("/developments/get/:id", developmentController.getOneDevelopment);
router.post("/developments/mod", developmentController.editDevelopment);
router.delete("/developments/:id", developmentController.deleteDevelopment);

// Coordinates routes
router.post("/developments/coords", developmentController.getCoordinates); // For POST requests to update or add coordinates

// Mapping info route
router.get("/developments/mapping/get", developmentController.getMappingInfo);

// Email route
router.post("/developments/send-email", emailController.sendMatchEmail);

module.exports = router;
