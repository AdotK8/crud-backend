const express = require("express");
const router = express.Router();
const developmentController = require("../controllers/developmentController");

router.post("/developments/add", developmentController.createDevelopment);
router.get("/developments/get", developmentController.getDevelopments);

module.exports = router;
