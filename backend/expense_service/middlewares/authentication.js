async function isAuthenticated(req, res, next) {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null

  // Communicate with account service to verify credentials
  const response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/auth/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  const data = await response.json();
  
  if (!data.loggedIn) {
    return res.status(500).json({ 
      success: false, 
      authenticate: false,
      message: "You are not authenticated" 
    });
  }

  req.locals = {
    loggedIn: data.loggedIn,
    user: data.user
  }
  return next();
}

module.exports = isAuthenticated;