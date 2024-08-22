// models/developmentModels.js
const mongoose = require("mongoose");
const developmentSchema = require("./development");

// Model for the existing "developments" collection
const Development = mongoose.model(
  "Development",
  developmentSchema,
  "developments"
);

// Model for the new "deletedDevelopments" collection
const DeletedDevelopment = mongoose.model(
  "DeletedDevelopment",
  developmentSchema,
  "deletedDevelopments"
);

module.exports = { Development, DeletedDevelopment };
