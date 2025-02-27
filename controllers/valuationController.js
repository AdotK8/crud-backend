const nodemailer = require("nodemailer");
const http = require("http");

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

exports.sendEmailFull = async (req, res) => {
  const { processedSaleData, processedRentData, userInput } = req.body;

  try {
    const emailBody = `<div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
    <p style="font-size: 16px;">Hi ${userInput.firstName},</p>
    <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
    <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average}  and can potentially achieve a price of ${processedSaleData.maximum} and an estimated rental price of ${processedRentData.rent}.</p>
    <p style="font-size: 16px;">If you would like to discuss how to get the most out of your property, please get in touch by replying to this email.</p>
    <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
    <a href="https://yaseproperty.com">
      <img src="https://i.postimg.cc/j2hNHR12/YASE-LOGO-PNG.png" alt="Your Image" style="max-width: 150px; height: auto;">
    </a>
  </div>`;

    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: userInput.emailInput,
      bcc: process.env.EMAIL_ADDRESS,
      subject: "Your Property Valuation and Next Steps with Yase Property",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    await sendInternalEmail(userInput);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};

exports.sendEmailSale = async (req, res) => {
  const { processedSaleData, userInput } = req.body;

  try {
    const emailBody = `<div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
    <p style="font-size: 16px;">Hi ${userInput.firstName},</p>
    <p style="font-size: 16px;">Thank you for filling out our property valuation calculator.</p>
    <p style="font-size: 16px;">Your Property has an estimated sale price of ${processedSaleData.average} and can potentially achieve a price of ${processedSaleData.maximum}.</p>
    <p style="font-size: 16px;">If you would like to discuss how to get the most out of your property, please get in touch by replying to this email.</p>
    <p style="font-size: 16px;">Yours sincerely,<br>Yase Team</p>
    <a href="https://yaseproperty.com">
      <img src="https://i.postimg.cc/j2hNHR12/YASE-LOGO-PNG.png" alt="Your Image" style="max-width: 150px; height: auto;">
    </a>
  </div>`;

    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: userInput.emailInput,
      bcc: process.env.EMAIL_ADDRESS,
      subject: "Your Property Valuation and Next Steps with Yase Property",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);
    await sendInternalEmail(userInput);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};

exports.sendEmailInternalFail = async (req, res) => {
  const { userInput } = req.body;

  try {
    const emailBody = `<p>The following client has failed to get their valuation</p>
      <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
      <p>Email address: ${userInput.emailInput} </p>
      <p>Number: ${userInput.phoneInput} </p>
      <p>Postcode: ${userInput.postcode} </p>`;

    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,
      subject: "Client failed to get valuation",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};

exports.sendEmailBookVal = async (req, res) => {
  const { userInput } = req.body;

  try {
    const emailBody = `<p>Following client has requested to book an accurate valuation/p>
      <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
      <p>Email address: ${userInput.emailInput} </p>
      <p>Number: ${userInput.phoneInput} </p>
      <p>Postcode: ${userInput.postcode} </p>`;

    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,
      subject: "Client has requested to book valuation ",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};

const sendInternalEmail = async (userInput) => {
  try {
    const internalEmailBody = `<p>Following client has used property valuation calculator:</p>
      <p>Full name: ${userInput.firstName} ${userInput.secondNameInput}</p>
      <p>Email address: ${userInput.emailInput} </p>
      <p>Number: ${userInput.phoneInput} </p>
      <p>Postcode: ${userInput.postcode} </p>`;

    const internalMailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS, // Your internal email address
      subject: "Client has used property valuation calculator",
      html: internalEmailBody,
    };

    await transporter.sendMail(internalMailOptions);
  } catch (error) {
    console.error("Error sending internal email:", error);
    throw new Error("Error sending internal email: " + error.message);
  }
};
