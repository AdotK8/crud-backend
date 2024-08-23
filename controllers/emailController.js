const nodemailer = require("nodemailer");
const http = require("http");

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
        <p>Hi,</p>

        <p>I hope this email finds you well and thank you for your time the other day.</p>

        <p>I have put together some options of properties for you to consider. Please have a look at the information below as well as the attachment links for brochures and pricing information.</p>

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

        <p>Once you have reviewed these options, do let me know your thoughts. I am happy to arrange for you to come on a viewing and see the properties in person.</p>

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
