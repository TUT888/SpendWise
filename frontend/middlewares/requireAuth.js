function requireAuth(req, res, next) {
  if (res.locals.loggedIn) return next();
  return res.redirect('/login');
}

module.exports = requireAuth;