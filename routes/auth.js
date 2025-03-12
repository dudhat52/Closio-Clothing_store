const express = require("express");
const router = express.Router();
const formValidator = require("../utils/validation");
const mailer = require("../utils/mailer");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !password) {
    errors.push("All fields are required.");
  }

  if (errors.length > 0) {
    return res.render("log-in", { title: "Log In", errors });
  }

  res.redirect("/dashboard");
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const errors = formValidator.validateRegistration(firstName, lastName, email, password);

  if (errors.length > 0) {
    return res.render("sign-up", { title: "Sign Up", errors });
  }

  // Send Welcome Email
  mailer.sendWelcomeEmail(email, firstName);

  res.redirect("/welcome");
});

router.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Welcome!" });
});

module.exports = router;
