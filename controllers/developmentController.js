const Development = require("../models/development");

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

exports.getDevelopments = async (req, res) => {
  try {
    const developments = await Development.find({});
    res.status(200).json(developments);
  } catch (error) {
    res.status(500).send("Error fetching development: " + error.message);
    //impement this error in frontend
  }
};
