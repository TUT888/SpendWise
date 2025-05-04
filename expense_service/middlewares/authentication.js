async function isAuthenticated(req, res, next) {
  const cookies = req.headers.cookie;
  // Communicate with account service to verify credentials
  const response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/account/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
  });
  const data = await response.json();

  if (data.loggedIn) {
      return next();
  }
  return res.status(500).json({ 
    success: false, 
    authenticate: false,
    message: "You are not authenticated" 
  });
}

module.exports = isAuthenticated;