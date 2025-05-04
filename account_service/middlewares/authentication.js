function isAuthenticated(req, res, next) {
  // If session is undefined -> redirect back to login page
  if (req.session.user) {
      return next();
  }
  // res.redirect('/login');
  return res.status(500).json({ 
    success: false, 
    authenticate: false,
    message: "You are not authenticated" 
  });
}

module.exports = isAuthenticated;