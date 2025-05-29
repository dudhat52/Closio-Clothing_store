const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });

module.exports.sendWelcomeEmail = (email, firstName) => {
  const message = {
    from: "CLOSIO <support@yourwebsite.com>",
    to: email,
    subject: "Welcome to CLOSIO!",
    html: `<h1>Welcome, ${firstName}!</h1>
      <p>
        Thank you for signing up on <strong>CLOSIO</strong>. We're excited to have you as part of our community!
      </p>
      <p>
        If you have any questions or need assistance, feel free to reach out to us. We're here to help!
      </p>
      <p>
        Best regards,<br>
        <strong>dhdudhat - Dish Dudhat</strong><br>
        Founder of <strong>CLOSIO</strong>
      </p>`
  };

  mg.messages.create(process.env.MAILGUN_DOMAIN, message)
    .then(() => console.log("Welcome email sent!"))
    .catch(err => console.error("MailGun Error:", err));
};
