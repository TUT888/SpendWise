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
  console.log(`Login status: ${data.loggedIn}`)

  res.locals.loggedIn = data.loggedIn;
  res.locals.user = data.user || null;
  
  // If it's the main page, return it directly
  if (req.url == "/") {
    return next();
  }

  const unauthenticated_paths = ['/register', '/login'];
  // When logged in, authorized access to specific routes
  if (data.loggedIn) {
    if (unauthenticated_paths.includes(req.url)) {
      return res.redirect('/');
    }
    return next();
  }
  
  // When not logged in, authorized access to login/register only
  if (unauthenticated_paths.includes(req.url)) {
    return next();
  }
  return res.redirect('/');
}

module.exports = isAuthenticated;