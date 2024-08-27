const express = require("express");
const router = express.Router();
const developmentController = require("../controllers/developmentController");
const emailController = require("../controllers/emailController");

router.post("/developments/add", developmentController.createDevelopment);
router.get("/developments/get", developmentController.getDevelopments);
router.get("/developments/get/:id", developmentController.getOneDevelopment);
router.post("/developments/mod", developmentController.editDevelopment);
router.delete("/developments/:id", developmentController.deleteDevelopment);
router.get("/developments/coords/get", developmentController.getCoordinates);
router.post("/developments/send-email", emailController.sendMatchEmail);
router.post("/developments/coords", developmentController.getCoordinates);

module.exports = router;
