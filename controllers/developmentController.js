const {
  Development,
  DeletedDevelopment,
} = require("../models/developmentModels");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.createDevelopment = async (req, res) => {
  req.body.zone = Number(req.body.zone);
  req.body.fee = Number(req.body.fee);
  try {
    const development = new Development(req.body);
    await development.save();
    await sendNotificationEmailCreation(development);
    res.status(201).send(development);
  } catch (error) {
    res.status(400).send("Error creating development: " + error.message);
  }
};

exports.editDevelopment = async (req, res) => {
  const { _id, ...updateFields } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (updateFields.zone !== undefined) {
    const zone = Number(updateFields.zone);
    if (isNaN(zone)) {
      return res.status(400).json({ message: "Invalid zone value" });
    }
    updateFields.zone = zone;
  }

  if (updateFields.fee !== undefined) {
    const fee = Number(updateFields.fee);
    if (isNaN(fee)) {
      return res.status(400).json({ message: "Invalid fee value" });
    }
    updateFields.fee = fee;
  }

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

exports.getMappingInfo = async (req, res) => {
  try {
    const developments = await Development.find({}).select({
      _id: 1,
      name: 1,
      coords: 1,
      completionYear: 1,
    });
    res.status(200).json(developments);
  } catch (error) {
    res.status(500).send("Error fetching developments: " + error.message);
  }
};

exports.getOneDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const development = await Development.findById(id).exec();

    if (!development) {
      return res.status(404).json({ message: "Development not found" });
    }

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

    // Send deletion notification email
    await sendNotificationEmailDelete(development);

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
      return res.status(400).json({ error: "Invalid postcode." });
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
        .send(
          "Coordinates not found for the provided postcode, please try another postcode"
        );
    }

    const { lat, lng } = data.results[0].geometry.location;
    return res.status(200).json({ latitude: lat, longitude: lng });
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? error.message
        : String(error);
    return res
      .status(500)
      .json({ error: "Error fetching postcode: " + errorMessage });
  }
};
exports.sendMatchEmail = async (req, res) => {
  const { selection, email, name } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi [Recipient's Name],,</p>

        <p>I hope this email finds you well, and thank you again for your time the other day. It was great discussing your preferences and requirements.</p>

        <p>Based on your specific preferences, I’ve carefully selected a range of properties that meet your needs in terms of location, amenities, and convenience. Below are the details for each option, Below are the details for each option, along with the relevant attachments. </p>

        ${selection
          .map((dev) => {
            const firstPartOfPostcode = dev.postcode.split(" ")[0];
            return `
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 5px; font-size: 16px; font-weight: bold;">
                  ${dev.name} – ${dev.area} (${firstPartOfPostcode})
                </h3>
                <ul style="list-style-type: none; padding-left: 0; margin: 5px 0 0;">
                  <li><strong>Amenities/Key features:</strong> ${
                    dev.emailCopy
                  }</li>
                  <li><strong>Travel Links:</strong> ${
                    dev.nearestStation
                  } Station (${dev.nearestStationDistance} min walk)</li>
                  <li><strong>Completion:</strong> ${
                    dev.completionQuarter !== "N/A"
                      ? dev.completionQuarter + " "
                      : ""
                  }${dev.completionYear}</li>
                </ul>

                ${
                  dev.brochures?.length > 0
                    ? `
                  <p><strong>Brochures:</strong> 
                    ${dev.brochures
                      .map(
                        (brochure, idx) => `
                      <a href="${brochure}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #1a0dab; margin-right: 10px;">
                        Brochure ${idx + 1}
                      </a>
                    `
                      )
                      .join(" ")}
                  </p>
                `
                    : ""
                }

                ${
                  dev.priceLists?.length > 0
                    ? `
                  <p><strong>Price Lists:</strong> 
                    ${dev.priceLists
                      .map(
                        (pl, idx) => `
                      <a href="${
                        pl.url
                      }" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: #1a0dab; margin-right: 10px;">
                        Price List ${idx + 1}
                      </a>
                    `
                      )
                      .join(" ")}
                  </p>
                `
                    : ""
                }
              </div>
            `;
          })
          .join("")}

        <p>As a buying agency in London, we help our clients obtain exclusive access to off-market plots, provide full transparency on available discounts, and negotiate on your behalf to secure the best possible deal.</p>
        
        <p>Once you’ve had a chance to review these options, feel free to share your thoughts. I’d be more than happy to arrange an in person viewing, or explore other opportunities to find the perfect property for you.</p>

        <p>Have a great day.</p>

        <p>Kind regards,</p>
        <p>${name}</p>
      </div>
    `;
    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Yase Property Selection",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};

const sendNotificationEmailCreation = async (development) => {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>A new development has been added to the database.</p>
      <p><strong>Name:</strong> ${development.name}</p>
    </div>
  `;

  const mailOptions = {
    from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: "New Development Added",
    html: emailBody,
  };

  await transporter.sendMail(mailOptions);
};

const sendNotificationEmailDelete = async (development) => {
  const emailBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>A development has been deleted from the database.</p>
      <p><strong>Name:</strong> ${development.name}</p>
    </div>
  `;

  const mailOptions = {
    from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: "Development Deleted",
    html: emailBody,
  };

  await transporter.sendMail(mailOptions);
};
