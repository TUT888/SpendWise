function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  }
  return res.status(500).json({ 
    success: false, 
    authenticate: false,
    message: "You are not authenticated" 
  });
}

module.exports = isAuthenticated;