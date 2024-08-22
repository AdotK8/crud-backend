const nodemailer = require("nodemailer");
const http = require("http");

exports.sendMatchEmail = async (req, res) => {
  const { selection, email } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Yase Property <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "Property Match",
      html: `
      <div>
        <h3>Your Property Matches:</h3>
        <ul>
          ${selection.map((dev) => `<li>${dev.name}</li>`).join("")}
        </ul>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email: " + error.message });
  }
};
