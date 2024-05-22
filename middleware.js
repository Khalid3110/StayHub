module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // redirect path save
    req.session.redirectUrl = req.origanlUrl;
    req.flash("error", "Please login to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
