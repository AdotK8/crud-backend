const mongoose = require("mongoose");
const developmentSchema = require("./development");

const Development = mongoose.model(
  "Development",
  developmentSchema,
  "developments"
);

const DeletedDevelopment = mongoose.model(
  "DeletedDevelopment",
  developmentSchema,
  "deletedDevelopments"
);

module.exports = { Development, DeletedDevelopment };
