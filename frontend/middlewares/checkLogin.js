const CHECK_AUTHENTICATION_STATUS_URL = `${process.env.ACCOUNT_SERVICE_URL}/api/account/status`;

async function checkLogin(req, res, next) {
  const cookies = req.headers.cookie;
  try {
    // Communicate with account service to verify credentials
    const response = await fetch(CHECK_AUTHENTICATION_STATUS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
    });
    const data = await response.json();
    console.log(`Login status: ${data.loggedIn}`)

    // Store user data per request
    res.locals.loggedIn = data.loggedIn;
    res.locals.user = data.user || null;
  } catch {
    res.locals.loggedIn = false;
    res.locals.user = null;
  }
  next();
}

module.exports = checkLogin;