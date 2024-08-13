const Development = require("../models/development");
const mongoose = require("mongoose");

exports.createDevelopment = async (req, res) => {
  req.body.zone = Number(req.body.zone);
  req.body.fee = Number(req.body.fee);
  try {
    const development = new Development(req.body);
    await development.save();

    res.status(201).send(development);
  } catch (error) {
    res.status(400).send("Error creating development: " + error.message);
  }
};

exports.editDevelopment = async (req, res) => {
  console.log(req.body);

  const { _id, ...updateFields } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  updateFields.zone = Number(updateFields.zone);
  updateFields.fee = Number(updateFields.fee);

  try {
    const updatedDevelopment = await Development.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedDevelopment) {
      return res.status(404).json({ message: "Development not found" });
    }

    res.status(200).json(updatedDevelopment);
  } catch (error) {
    console.error("Error updating development:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDevelopments = async (req, res) => {
  try {
    const developments = await Development.find({});
    res.status(200).json(developments);
  } catch (error) {
    res.status(500).send("Error fetching developments: " + error.message);
    //impement this error in frontend
  }
};

exports.getOneDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const development = await Development.findById(id).exec();
    res.status(200).json(development);
  } catch (error) {
    res.status(500).send("Error fetching development: " + error.message);
  }
};

exports.deleteDevelopment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format." });
    }

    const result = await Development.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Development not found." });
    }

    res.status(200).json({ message: "Development deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting development: " + error.message });
  }
};
