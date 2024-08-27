const {
  Development,
  DeletedDevelopment,
} = require("../models/developmentModels");
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
    const developments = await Development.find({}).sort({ name: 1 });
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

    const development = await Development.findById(id);

    if (!development) {
      return res.status(404).json({ error: "Development not found." });
    }

    await Development.findByIdAndDelete(id);

    await DeletedDevelopment.create(development.toObject());

    res
      .status(200)
      .json({ message: "Development deleted and archived successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting development: " + error.message });
  }
};

exports.getCoordinates = async (req, res) => {
  try {
    const { postcode } = req.body;

    if (!postcode || postcode.trim().length < 3) {
      return res.status(400).send("Invalid postcode.");
    }

    const [postcodeOne, postcodeTwo] = postcode.split(" ");
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcodeOne}+${postcodeTwo}&key=${process.env.MAP_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error fetching data from Google Maps API");
    }

    const data = await response.json();

    if (data.status !== "OK" || data.results.length === 0) {
      return res
        .status(404)
        .send("Coordinates not found for the provided postcode.");
    }

    const { lat, lng } = data.results[0].geometry.location;

    res.json({ latitude: lat, longitude: lng });
  } catch (error) {
    res.status(500).send("Error fetching postcode: " + error.message);
  }
};
