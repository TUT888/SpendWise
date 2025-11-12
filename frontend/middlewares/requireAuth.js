function requireAuth(req, res, next) {
  if (req.locals && req.locals.loggedIn) return next();
  return res.redirect('/login');
}

module.exports = requireAuth;