const passport = require("passport");

exports.googleAuthCallback = (req, res) => {
  res.redirect(req.user ? "http://localhost:3000/dashboard" : "http://localhost:3000/login");
};

exports.loginSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000");
};
