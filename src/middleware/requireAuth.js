function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login?error=Please+login+to+access+owner+features.");
  }

  next();
}

module.exports = requireAuth;
